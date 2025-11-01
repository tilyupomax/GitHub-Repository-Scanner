import { ApolloError } from "@apollo/client";

/**
 * Determine whether an Apollo error represents a 404/not found response
 */
export function isNotFoundError(error: unknown): boolean {
  if (!(error instanceof ApolloError)) {
    return false;
  }

  const hasNotFoundExtension = error.graphQLErrors.some(({ extensions }) => {
    const code = typeof extensions?.code === "string" ? extensions.code : undefined;
    const httpExtension = extensions?.http as { status?: number } | undefined;
    const httpStatus = typeof httpExtension?.status === "number" ? httpExtension.status : undefined;

    return code === "NOT_FOUND" || httpStatus === 404;
  });

  if (hasNotFoundExtension) {
    return true;
  }

  const networkError = error.networkError as
    | { status?: number; statusCode?: number }
    | null
    | undefined;

  return networkError?.status === 404 || networkError?.statusCode === 404;
}
