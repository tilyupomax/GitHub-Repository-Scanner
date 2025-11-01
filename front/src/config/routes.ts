/**
 * Application routes configuration
 * Single source of truth for all route paths
 */
export const routes = {
  home: {
    value: "/",
  },
  repository: {
    value: "/repo",
    details: (name: string) => `/repo/${name}`,
  },
} as const;
