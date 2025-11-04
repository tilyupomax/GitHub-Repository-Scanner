# GitHub Repository Scanner

A full-stack application for scanning and analyzing GitHub repositories. This project consists of a NestJS GraphQL backend that interfaces with the GitHub API and a Next.js frontend that provides an intuitive UI for exploring repository insights.

## 📋 Overview

The GitHub Repository Scanner is a monorepo containing two main applications:

- **Backend**: NestJS-based GraphQL API that wraps the GitHub REST API with worker-thread support for intensive operations
- **Frontend**: Next.js 16 application with server components, Apollo Client, and Material UI

This tool allows you to:
- 📊 Scan and analyze GitHub repositories
- 🔍 View detailed repository metrics (size, file counts, visibility)
- 📝 Inspect YAML configuration files
- 🔗 Monitor active webhooks
- ⚡ Efficiently process large repositories using worker threads

## 🏗️ Architecture

```
GitHub-Repository-Scanner/
├── backend/          # NestJS GraphQL API
│   ├── src/
│   │   ├── github/   # GitHub integration & GraphQL resolvers
│   │   └── common/   # Shared utilities
│   └── libs/
│       └── config/   # Environment configuration
├── front/            # Next.js frontend
│   └── src/
│       ├── api/      # GraphQL operations & hooks
│       ├── app/      # Next.js App Router pages
│       ├── components/ # Shared UI components
│       └── providers/ # Apollo & Theme providers
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **pnpm 10+**
- **GitHub Personal Access Token** with `repo` scope
- **Docker & Docker Compose** (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```powershell
   git clone https://github.com/tilyupomax/GitHub-Repository-Scanner.git
   cd GitHub-Repository-Scanner
   ```

2. **Setup Backend**
   ```powershell
   cd backend
   Copy-Item .env.example .env -Force
   # Edit .env and add your GITHUB_TOKEN and REPOSITORIES_TO_FETCH
   pnpm install
   pnpm run start:dev
   ```
   The GraphQL API will be available at `http://localhost:4200/graphql`

3. **Setup Frontend** (in a new terminal)
   ```powershell
   cd front
   Copy-Item .env.example .env.local -Force
   # Edit .env.local if needed (default backend URL is http://localhost:4200/graphql)
   pnpm install
   pnpm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### Using Docker Compose

For a containerized setup:

```powershell
# In the backend directory
$env:GITHUB_TOKEN = "ghp_xxx"
$env:REPOSITORIES_TO_FETCH = '["repo1","repo2"]'
docker compose up --build

# In the front directory
docker compose up --build
```

## 🛠️ Technology Stack

### Backend
- **NestJS 11** - Progressive Node.js framework
- **Apollo Server 5** - GraphQL server
- **Octokit** - GitHub API client
- **Workerpool** - Multi-threaded repository analysis
- **TypeScript** - Type-safe development

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with server components
- **Apollo Client 3** - GraphQL client with SSR support
- **Material UI 7** - Component library and design system
- **TypeScript 5** - Strict type checking

## 📚 Documentation

For detailed information about each component:

- [Backend Documentation](./backend/README.md) - API setup, GraphQL schema, and architecture details
- [Frontend Documentation](./front/README.md) - UI components, routing, and data flow

## 🔑 Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token |
| `REPOSITORIES_TO_FETCH` | Yes | JSON array of repository names |
| `PORT` | No | Server port (default: 4200) |
| `FRONTEND_URL` | No | CORS origin (default: http://localhost:3000) |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GRAPHQL_URL` | No | Backend GraphQL endpoint (default: http://localhost:4200/graphql) |

## 🧪 Testing

### Backend
```powershell
cd backend
pnpm run test        # Unit tests
pnpm run test:e2e    # End-to-end tests
pnpm run test:cov    # Coverage report
```

### Frontend
```powershell
cd front
pnpm run lint        # ESLint checks
```

## 📦 Building for Production

### Backend
```powershell
cd backend
pnpm run build
pnpm run start:prod
```

### Frontend
```powershell
cd front
pnpm run build
pnpm run start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the UNLICENSED license.

## � Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For information about AI-assisted development with GitHub Copilot, see the instructions in the `.github` folder.

## 📄 License

## 👤 Author

**tilyupomax**

---

For more specific information, please refer to the individual README files in the `backend/` and `front/` directories.
