# GitHub Repository Scanner - Frontend

A Next.js 16 application that consumes the NestJS GraphQL backend to explore GitHub repositories, inspect repository metadata, and surface operational insights. This is the user-facing component of the GitHub Repository Scanner monorepo, providing an intuitive interface for repository analysis.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Docker Workflow](#docker-workflow)
- [Code Style & Conventions](#code-style--conventions)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

The frontend presents an operator-friendly interface for browsing repositories indexed by the companion backend. It lists repositories with quick filtering, routes to details pages, renders YAML configuration samples, and highlights active webhooks. Server components handle SSR data fetching, while client components provide focused interactivity. 

This application is part of the **GitHub Repository Scanner** monorepo and works in conjunction with the NestJS backend to provide a complete repository analysis solution. The frontend embraces server components by default, Apollo Client for data access, and Material UI for a cohesive design system.

**Note**: The backend only surfaces repositories explicitly whitelisted via its environment configuration, so ensure the desired owner/name pairs are present there before expecting them to appear in the UI.

## Key Features

- 🔍 Repository catalogue with owner-based filtering and quick navigation
- 📊 Detailed repository view with size, file counts, and visibility badges
- 🔁 Server-side rendering via Next.js App Router for fast first paint
- 📡 GraphQL data fetching with Apollo Client, including SSR cache hydration
- 🎨 Material UI theme with responsive layout primitives
- ⚙️ Docker-ready workflow for local or containerized deployment

## Technology Stack

### Core Framework

- **Next.js 16.0.x** with the App Router and server components
- **React 19** with compiler-friendly pure components
- **TypeScript 5.x** with strict mode and path aliases (`@/*`)

### Data & APIs

- **@apollo/client 4** for GraphQL queries, caching, and SSR integration
- **@apollo/client-integration-nextjs** for App Router bindings
- Domain-specific GraphQL operations placed in `src/api/repositories`

### UI & Styling

- **Material UI 7** component system with theming in `src/theme`
- **Emotion** caching for SSR styles
- Custom layout primitives in `src/components/layout` and UI wrappers in `src/components/ui`

### Tooling

- **pnpm 10+** for package management
- **ESLint 9** with project conventions
- **Prettier 3** via ESLint integration
- **babel-plugin-react-compiler** for automatic optimizations

The project follows a feature-oriented structure and leans on barrel files (`index.ts`) to expose public APIs.

## Architecture

```text
src/
├── api/
│   └── repositories/          # GraphQL operations, DTOs, and hooks
├── app/                       # Next.js route segments (App Router)
│   ├── _components/           # Client components for specific routes
│   ├── repo/[owner]/[name]/   # Repository details route
│   ├── layout.tsx             # Root layout with shared providers
│   └── page.tsx               # Home page (repository list)
├── components/                # Shared UI building blocks
├── config/routes.ts           # Single source of truth for route paths
├── providers/                 # Application-wide providers (Apollo, Theme)
├── services/graphql/          # Apollo client configuration and helpers
├── theme/                     # MUI theme and overrides
└── utils/                     # Reusable helpers
```

### Data Flow

1. Server components invoke repository queries through Apollo Client (`getClient()` from `src/services/graphql/client.ts`).
2. GraphQL documents and hooks live under `src/api/repositories/queries` and are re-exported for consistent imports.
3. Client components such as `RepositoryTableClient` handle interactivity (filtering, row navigation) and are isolated behind the `"use client"` directive.
4. Route definitions originate from `src/config/routes.ts`, ensuring consistent navigation across server and client code.

### Styling Strategy

- Global styles are minimal and live in `src/app/globals.css`.
- The custom MUI theme is defined in `src/theme/theme.ts` and provided via `src/providers/ThemeProvider.tsx`.
- Shared wrappers for common UI patterns live in `src/components/ui`, keeping pages lean and declarative.

## Getting Started

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **pnpm 10+**
- Running backend GraphQL API (default: `http://localhost:4200/graphql`)

### Installation

```bash
pnpm install
```

### Configure Environment

```bash
cp .env.example .env.local
```

Update `.env.local` to point to your backend GraphQL endpoint. See [Environment Variables](#environment-variables) for available keys.

### Run in Development

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser. Client and server components support hot reload.

### Production Build

```bash
pnpm build
pnpm start
```

`pnpm build` outputs the production bundle, and `pnpm start` runs the optimized server.

### Linting

```bash
pnpm lint
```

Linting uses the project ESLint configuration and runs Prettier formatting checks.

## Environment Variables

| Variable                         | Required | Description                                                                         | Default                                    |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_GRAPHQL_URL`        | Yes      | URL of the NestJS GraphQL API for local development                                 | `http://localhost:4200/graphql`            |
| `NEXT_PUBLIC_APP_NAME`           | No       | Optional display name for the application                                           | `GitHub Repository Scanner`                |
| `NODE_ENV`                       | No       | Standard Node environment (`development`, `production`, `test`)                     | `development`                              |

Persist local overrides in `.env.local`; these values are automatically loaded by Next.js.

## Available Scripts

```bash
pnpm dev      # Start the development server
pnpm build    # Create an optimized production build
pnpm start    # Serve the production build
pnpm lint     # Run ESLint with Prettier integration
```

## Docker Workflow

A Dockerfile and docker-compose configuration are provided for containerized setups.

```bash
# Build the image
docker build -t github-scanner-frontend .

# Run via Docker Compose (frontend + dependencies as defined in docker-compose.yml)
docker-compose up
```

The frontend is exposed on `http://localhost:3000`. Ensure the backend URL inside `.env.local` matches your container network or host configuration.

## Code Style & Conventions

- Favor server components; add `"use client"` only when React hooks or browser APIs are required.
- Keep imports ordered: type-only, builtins, externals, `@/*` aliases, then relative paths.
- Expose feature surfaces through barrel files to maintain clean boundaries.
- Maintain strict typing—avoid `any`, prefer discriminated unions and DTOs.
- Update `src/config/routes.ts` whenever a route path changes or a new page is added.
- Wrap reusable UI in `src/components/ui` and funnel imports through the corresponding `index.ts` barrels.

## Troubleshooting

- **Apollo Client errors**: Confirm `NEXT_PUBLIC_GRAPHQL_URL` points to a reachable GraphQL endpoint.
- **Styles not rendering**: Verify `ThemeProvider` remains wrapped around layouts (`src/app/layout.tsx`).
- **Route 404s**: Ensure any new route segment is registered in `src/config/routes.ts` and that folder names match Next.js dynamic route syntax.
- **Docker networking**: When running the backend separately, expose the GraphQL port and update the frontend environment variable accordingly.

## Contributing

1. Fork the repository and create a feature branch.
2. Follow the existing project structure and naming conventions.
3. Run `pnpm lint` before submitting a pull request.
4. Document new components, utilities, or configuration changes in the relevant README sections.

## Related Documentation

- [Main Repository README](../README.md) - Overview of the entire GitHub Repository Scanner project
- [Backend README](../backend/README.md) - NestJS GraphQL API documentation

## Performance Tips

- **Server Components**: Leverage server components for data fetching to reduce client-side JavaScript
- **Apollo Caching**: Configure appropriate cache policies for repository data
- **Code Splitting**: Next.js automatically code-splits routes; avoid heavy client-side bundles
- **Image Optimization**: Use Next.js `<Image>` component for automatic optimization

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

Modern browsers with ES2020+ support are required due to React 19 and Next.js 16 dependencies.

## Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js applications)
- **Docker** (using the included Dockerfile)
- **Node.js servers** (after `pnpm build`)

Ensure environment variables are properly configured in your deployment platform.

## License

This project is part of the GitHub Repository Scanner monorepo.

---

**Part of the [GitHub Repository Scanner](../README.md) monorepo**

*For information about AI-assisted development, see the `.github` folder.*
