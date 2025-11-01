"use client";

import type { ReactNode } from "react";

import { ApolloProvider } from "@apollo/client";

import { makeClient } from "@/services/graphql/client";

interface ApolloWrapperProps {
  children: ReactNode;
}

// Create a single client instance for the app
const client = makeClient();

/**
 * Apollo Client wrapper for client components
 */
export function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
