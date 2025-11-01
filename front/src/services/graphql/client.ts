import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

if (!graphqlUrl) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_URL environment variable is not set.");
}

/**
 * Create Apollo Client for server-side usage (RSC)
 * Creates a new client instance for each request
 */
export function getClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: graphqlUrl,
      fetchOptions: { cache: "no-store" },
    }),
  });
}

/**
 * Create Apollo Client for client-side usage
 * Used in client components wrapped with ApolloWrapper
 */
export function makeClient() {
  const httpLink = new HttpLink({
    uri: graphqlUrl,
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
