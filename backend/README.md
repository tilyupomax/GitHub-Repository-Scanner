# GitHub Repository Scanner - Backend

A NestJS-based GraphQL API that wraps the GitHub REST API and exposes repository insights through an Apollo GraphQL endpoint. This backend service is part of the GitHub Repository Scanner monorepo and provides the data layer for the Next.js frontend application.

## Project Overview

This backend service efficiently analyzes GitHub repositories by:
- Keeping outbound traffic bounded through rate limiting on active requests
- Offloading CPU-intensive repository analysis to worker threads
- Providing a GraphQL interface for easy frontend integration
- Supporting concurrent processing of multiple repositories

## Features

- GraphQL queries for curated repository summaries and in-depth details (file counts, YAML sample, webhook info).
- Octokit-powered GitHub integration with automatic owner detection from the provided token.
- Worker-thread pool (via `workerpool`) that analyzes repository trees and normalizes YAML content without blocking the main event loop.
- Concurrency limiter on outbound GitHub calls to stay within rate limits.
- Centralized runtime configuration backed by typed environment validation.

## Architecture Overview

- **NestJS Modules**: `GithubModule` wires Octokit, the repository worker service, and GraphQL resolvers. Additional shared utilities live under `src/common`.
- **Configuration**: `libs/config` loads `.env` values, validates them with `envalid`, and exposes a typed config object consumable across the app.
- **GraphQL Layer**: SDL-first schema generated from decorators in `src/github/graphql`. Queries resolve via `GithubService`.
- **Background Workers**: `RepositoryWorkerService` manages a worker pool sized to available CPUs. Workers calculate aggregate repository metrics and decode YAML samples.
- **Error Handling**: Responses from Octokit funnel through `asGraphQLError`, giving clients consistent error codes such as `GITHUB_API_ERROR`.

## Requirements

- Node.js 20+
- pnpm 9+
- GitHub personal access token with `repo` scope (recommended PAT v1)

Docker users need Docker Engine 24+ and Docker Compose v2.

## Quick Start

1. Copy the sample environment file and tweak it for your setup:

   ```powershell
   Copy-Item .env.example .env -Force
   ```

2. Edit `.env` and provide values for the variables listed below. At minimum set `GITHUB_TOKEN` and `REPOSITORIES_TO_FETCH`.

3. Install dependencies and launch the service:

   ```powershell
   pnpm install
   pnpm run start:dev
   ```

   The GraphQL Playground becomes available at `http://localhost:4200/graphql`.

## Environment Variables

| Variable                | Required | Default                 | Description                                                                                                                                                                        |
| ----------------------- | -------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`          | Yes      | –                       | GitHub PAT used for API requests; the backend infers the owner from this token.                                                                                                    |
| `REPOSITORIES_TO_FETCH` | Yes      | `[]`                    | JSON array of repository names (e.g. `["docs", "backend"]`). Provide names owned by the authenticated user/organization; optional `owner/name` values override the inferred owner. |
| `PORT`                  | No       | `4200`                  | Port for the HTTP server.                                                                                                                                                          |
| `FRONTEND_URL`          | No       | `http://localhost:3000` | Origin allowed through CORS.                                                                                                                                                       |
| `NODE_ENV`              | No       | `local`                 | Execution environment, currently only `local` is supported.                                                                                                                        |

All values are validated at boot; missing or malformed entries surface descriptive startup errors.

The service processes only repositories listed in `REPOSITORIES_TO_FETCH`; anything not declared in that JSON array is ignored.

## Running Options

- **Development (watch mode)**: `pnpm run start:dev`
- **Debug mode**: `pnpm run start:debug`
- **Production build**: `pnpm run build` followed by `pnpm run start:prod`

### Docker Compose

The included `docker-compose.yml` builds the production image, exposes port `4200`, and accepts environment overrides:

```powershell
$env:GITHUB_TOKEN = "ghp_xxx"
$env:REPOSITORIES_TO_FETCH = '["backend","frontend"]'
docker compose up --build
```

When running in containers, verify the token grants repository access, otherwise GitHub calls will return `404`/`401` errors.

## GraphQL Usage

- API endpoint: `http://localhost:4200/graphql`
- Playground: enabled in non-production modes.

Example operations:

```graphql
query ListRepositories {
  repositories {
    name
    owner
    size
  }
}

query RepositoryDetails {
  repositoryDetails(name: "backend") {
    name
    owner
    size
    isPrivate
    fileCount
    yamlSample {
      path
      content
    }
    activeWebhooks {
      id
      name
      url
    }
  }
}
```

If a repository tree is too large for GitHub to return in a single request, the service raises a GraphQL error explaining that the tree is truncated.

## Background Processing

- Outbound repository fetches are throttled with `p-limit` (default concurrency 2) to stay within GitHub rate limits.
- Tree analysis and YAML normalization run in a worker thread pool sized to detected logical CPUs, keeping the main process responsive even for large repositories.
- Workers locate the first YAML file in the tree, base64-decode its contents, and attempt to parse/reformat it; if parsing fails, the raw trimmed content is returned.

## Testing & Quality

- `pnpm run test`: unit tests with Jest.
- `pnpm run test:e2e`: end-to-end tests under `test/`.
- `pnpm run lint`: ESLint (with auto-fix) across `src`, `libs`, and `test`.
- `pnpm run format`: Prettier for consistent formatting.

## Project Structure

```
src/
  app.module.ts          # Bootstraps NestJS application
  common/
    utils/               # Shared helpers (e.g., GitHub error coercion)
  github/
    dtos/                # GraphQL DTOs and argument types
    graphql/             # Resolver definitions
    services/            # Octokit service + worker facade
    workers/             # Worker scripts executed via workerpool
libs/
  config/                # Typed configuration loader and env validation
test/                    # Jest e2e tests and configuration
schema.gql               # Generated GraphQL schema snapshot
```

## Troubleshooting

- **401 or 404 from GitHub**: Ensure `GITHUB_TOKEN` has `repo` scope and access to the listed repositories.
- **Startup fails with env validation error**: Check `.env` for JSON syntax (especially `REPOSITORIES_TO_FETCH`).
- **Tree truncated error**: Reduce repository size or filter the repository list; GitHub limits tree responses to ~100k entries.
- **CORS blocks requests**: Update `FRONTEND_URL` to match the origin of your frontend application.

## Next Steps

- Hook the GraphQL endpoint into the frontend application using a GraphQL client (e.g., Apollo Client or urql).
- Extend the schema with additional metrics by adding resolvers under `src/github/graphql` and exposing them via DTOs.

## Related Documentation

- [Main Repository README](../README.md) - Overview of the entire GitHub Repository Scanner project
- [Frontend README](../front/README.md) - Next.js application that consumes this API

## Tech Stack

- **NestJS 11** - Progressive Node.js framework for building efficient server-side applications
- **Apollo Server 5** - GraphQL server implementation
- **Octokit REST** - Official GitHub REST API client
- **Workerpool** - Multi-threading library for CPU-intensive operations
- **TypeScript** - Strongly-typed JavaScript for enhanced developer experience
- **GraphQL** - Query language for APIs

## API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4200/graphql`
- **Method**: POST
- **Content-Type**: `application/json`

### GraphQL Playground
- **URL**: `http://localhost:4200/graphql`
- **Available in**: Development mode only
- **Features**: Interactive query builder, schema documentation, query history

## Performance Considerations

- **Rate Limiting**: Configured to limit concurrent GitHub API requests (default: 2 concurrent requests)
- **Worker Threads**: Utilizes all available CPU cores for parallel repository analysis
- **Response Caching**: Consider implementing Apollo Server caching for frequently accessed repositories
- **GitHub API Limits**: Authenticated requests have a limit of 5,000 requests per hour

## Security Notes

- Never commit your `.env` file or expose your `GITHUB_TOKEN`
- Use environment-specific tokens (development, staging, production)
- Ensure CORS is properly configured for your frontend domain
- Consider implementing rate limiting on the GraphQL endpoint for production deployments

## Monitoring & Logging

The application logs important events and errors to the console. In production, consider:
- Integrating with logging services (Winston, Pino)
- Setting up error tracking (Sentry, Rollbar)
- Monitoring API performance and GitHub API rate limit consumption

---

**Part of the [GitHub Repository Scanner](../README.md) monorepo**

*For information about AI-assisted development, see the `.github` folder.*
