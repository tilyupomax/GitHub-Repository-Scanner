import type { Repository, RepositoryDetails } from "../types";

import { getClient } from "@/services/graphql/client";
import { isNotFoundError } from "@/services/graphql/utils";

import { GET_REPOSITORIES, GET_REPOSITORY_DETAILS } from "./queries";

/**
 * Server-side function to fetch all repositories
 */
export async function getRepositories(): Promise<Repository[]> {
  const client = getClient();
  const { data } = await client.query<{ repositories: Repository[] }>({
    query: GET_REPOSITORIES,
  });

  return data?.repositories ?? [];
}

/**
 * Server-side function to fetch repository details by name
 */
export async function getRepositoryDetails(name: string): Promise<RepositoryDetails | null> {
  const client = getClient();
  try {
    const { data } = await client.query<{ repositoryDetails: RepositoryDetails }>({
      query: GET_REPOSITORY_DETAILS,
      variables: { name },
    });

    return data?.repositoryDetails ?? null;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}
