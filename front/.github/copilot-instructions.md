# Copilot Instructions

## Purpose

These guidelines help GitHub Copilot align code suggestions with the conventions and architecture of this project. Follow them when generating, editing, or refactoring code.

## Ground Rules

- Obey the existing ESLint (`eslint.config.mjs`) and Prettier configurations; suggestions must lint and format cleanly.
- Write TypeScript-first code. Avoid `any`, prefer discriminated unions or generics, and keep types in sync with runtime behaviour.
- Keep React components small, focused, and typed via explicit props interfaces or type aliases.
- Default to server components in the Next.js App Router. Only mark files with `"use client"` when client-side hooks or browser-only APIs are required.
- Use descriptive naming, prefer immutable patterns, and never introduce side effects during module evaluation.
- Name page-level components with a `Page` suffix (e.g., `HomePage`).
- Preserve the established import order: types, builtins, externals, internals (`@/*`), then relative paths.
- Create `index.ts` barrels to re-export public APIs for each folder and subfolder so imports stay stable and scoped.
- Treat `src/config/routes.ts` as the single source of truth for paths. Keep each entry in the `{ value: string, ...subroutes }` shape and update it whenever a page is added or a route path changes.
- Manage dependencies with pnpm. Use `pnpm add`/`pnpm update` for packages and invoke scripts through `pnpm <script>`.

## Project Layout

```
.
├── public/                         # Static assets served as-is
└── src/
    ├── app/                        # App Router entry points and route segments
    │   ├── globals.css             # Global base styles and resets
    │   ├── layout.tsx              # Root layout; wraps pages with shared providers
    │   └── (route folders/_components/<name>Client.tsx(if needed), _hooks, route folders)
    ├── components/
    │   ├── layout/                 # Cross-cutting layout primitives (headers, navigation, shells)
    │   ├── ui/                     # MUI component wrappers with typed props and theme variants
    │   └── <shared-name>/          # Cross-feature building blocks exposed via barrel
    ├── features/
    │   ├── index.ts                # Barrel for feature domains
    │   └── <domain>/
    │       ├── index.ts            # Barrel for the domain surface
    │       ├── components/         # Domain-specific UI composed from ui primitives
    │       ├── hooks/              # Domain hooks (state mgmt, derived data); GraphQL hooks stay under api/queries
    │       ├── types/              # Domain DTOs, input params, discriminated unions
    │       └── utils/              # Domain-only helpers; re-export from barrel files
    ├── hooks/                      # App-wide hooks that are not domain-specific
    ├── theme/                      # MUI theme configuration and overrides
    │   ├── index.ts                # Barrel for theme exports
    │   ├── theme.ts                # MUI theme definition with custom tokens, palette, typography
    │   └── components/             # Component-level theme overrides (optional)
    ├── utils/
    │   ├── index.ts                # Barrel for shared utility functions
    │   └── utils.ts                # Shared helpers (e.g., formatting, class name utilities)
    ├── providers/                  # Composition root for global providers (ThemeProvider, Apollo, etc.)
    ├── services/                   # Client or server integrations (HTTP, analytics, GraphQL)
    │   ├── graphql/
    │   │   └── client.ts           # Apollo Client setup and cache helpers shared across features
    ├── stores/                     # State management (e.g., Zustand) scoped by feature, only here
    ├── styles/                     # Global CSS modules (rare; prefer MUI theming)
    ├── types/                      # Shared TypeScript types and schemas
    ├── config/                     # Runtime configuration, constants, feature flags
    │   └── routes.ts               # Single source of truth for route paths
    └── api/                        # Cross-feature API layer
        ├── index.ts                # Barrel for all API entities
        └── <entity>/
            ├── index.ts            # Barrel for the entity API surface
            ├── queries/            # GraphQL operations and hooks. Inside hooks call the fetchers from the api class and can create transformers
            │   └── index.ts        # Barrel for query exports
            ├── mutations/          # GraphQL mutations and hooks. Inside hooks call the fetchers from the api class and can create transformers
            │   └── index.ts        # Barrel for mutation exports
            ├── transformers/       # DTO transformers for requests and responses
            │   └── parse-response.ts  # Example transformer to parse and validate API responses
            └── <entity>.api.ts     # Class with all requests to API, use axios inside class. Exposes methods for queries and mutations
```

Within each feature directory, expose only the public API from an `index.ts` barrel to keep boundaries explicit. When a concern grows, prefer new top-level buckets under `src/` over nesting deeply inside unrelated modules.

## Shared Components & GraphQL Data

- House reusable, cross-feature UI in `src/components`:
  - **`src/components/ui`**: Wrap MUI primitives (Button, TextField, Card, etc.) with typed props and theme-aware variants. Export through `index.ts` barrel.
  - **`src/components/layout`**: Place layout shells (headers, navigation, sidebars, footers) here and expose them via barrel.
  - **Other shared components**: Give each its own folder with an `index.ts` barrel for stable imports.
- Keep feature-scoped UI within `src/features/<feature>/components` and re-export it via that folder's `index.ts`. If a component graduates to cross-feature use, move it into `src/components/<name>` and expose it through the shared barrel.
- Place shared GraphQL utilities in `src/services/graphql/` (client setup, fragments, cache helpers), and scope entity-specific operations, hooks, and transformers to `src/api/<entity>`.
- For network logic reused by several features, create neutral modules under `src/api`, and expose their public surface through the local `<entity>.api.ts` barrel.
- Always funnel imports through the relevant barrel file (e.g., `src/components/ui/index.ts`, `src/api/<entity>/index.ts`) to avoid tight coupling between features.

## GraphQL Structure

- Domain-specific API logic lives in `src/api/<entity>`, with `queries/` for GraphQL documents, generated types, and Apollo hooks; `mutations/` remains the home for mutation helpers, and `transformers/` holds DTO mapping.
- Keep GraphQL documents colocated with their entities. Export parsed documents from `queries/index.ts` and expose convenience hooks that wrap Apollo Client while preserving typing.
- Re-export each entity surface from `<entity>.api.ts`, combining queries, mutations, fragments, and any shared transformers.
- Gather domain DTOs, input types, and discriminated unions under `src/features/<domain>/types` and re-export them from that folder's barrel.

## Key Packages & How To Use Them

- **Next.js 16** (`next`, `react`, `react-dom`): Build routes under `src/app`. Prefer server actions/data loading where possible.
- **@apollo/client**: Use Apollo Client for GraphQL data fetching, caching, and subscriptions. Wrap client components with the Apollo provider exported from `@apollo/client-integration-nextjs` and colocate documents next to their hooks.
- **@mui/material** & **@mui/system**: Use Material UI components and styling primitives. Keep the project theme and shared overrides under `src/styles/theme.ts` and compose variants via lightweight wrappers.
- **lucide-react**: Use for iconography. Tree-shake by importing only the icons you need.
- **babel-plugin-react-compiler**: Keep components pure (no impure side effects) to benefit from React Compiler optimizations.

## Coding Best Practices

- **Colocate UI with logic**: create feature-specific subfolders (e.g., `src/features/scores/components/...`). Export public APIs via index files to control boundaries.
- **Derive client components carefully**: when a component uses `useState`, `useEffect`, context hooks, or browser APIs, include `"use client"` at the top.
- **Data fetching**: prefer server components + async/`fetch` for static/SSR use cases; reach for Apollo Client hooks only when interactive or subscription-driven data is required.
- **Styling with MUI**:
  - Compose UI primarily through Material UI theming defined in `src/theme/theme.ts`. Avoid inline styles or CSS-in-JS outside the theme when possible.
  - Extend MUI components via the `sx` prop or by creating typed wrappers in `src/components/ui`.
  - Keep global CSS minimal (`app/globals.css` for resets only); prefer MUI's theming system for colors, spacing, typography, and breakpoints.
  - Use CSS modules sparingly and only when MUI theming is insufficient.
- **MUI component wrappers**:
  - Create wrappers in `src/components/ui` to encapsulate common patterns (e.g., `PrimaryButton`, `FormTextField`).
  - Extend them with typed props and theme-aware variants rather than mutating upstream MUI components.
  - Keep animations, tokens, and shared state colocated with the wrapping component.
  - Always export wrappers through the `src/components/ui/index.ts` barrel.
- **Forms and mutations**: use Apollo Client mutations with optimistic updates when UX requires it. Handle errors via MUI Snackbar or Alert components.
- **Accessibility**: follow `eslint-plugin-jsx-a11y` recommendations. Always include `alt` text, `aria` attributes, and semantic markup. MUI components include built-in accessibility features—preserve them.
- **Error handling**: bubble fatal errors to error boundaries; surface recoverable errors with user-facing messaging using MUI feedback components.
- **Testing** (when introduced): co-locate tests next to the implementation (`component.test.tsx`, `hook.test.ts`). Ensure stories or tests wrap components with MUI's `ThemeProvider` and mock Apollo providers when required.

## Tooling Workflow

- Run `pnpm dev` for local development.
- Use `pnpm lint` before committing; add project-specific format scripts as needed and invoke them with pnpm.
- Keep dependencies in `package.json` synchronized and lockfile updates committed (`pnpm install` manages `pnpm-lock.yaml`). Document significant upgrades in `README.md`.

Adhering to these instructions ensures Copilot contributes code that fits the project architecture and coding standards.
