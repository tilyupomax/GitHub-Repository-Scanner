import { gql } from "@apollo/client";

/**
 * GraphQL query to fetch all repositories
 */
export const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
      name
      size
      owner
    }
  }
`;

/**
 * GraphQL query to fetch repository details by repository name
 */
export const GET_REPOSITORY_DETAILS = gql`
  query GetRepositoryDetails($name: String!) {
    repositoryDetails(name: $name) {
      name
      size
      owner
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
`;
