import { GraphQLError } from 'graphql';

export type OctokitError = {
  status?: number;
  message?: string;
};

export const asGraphQLError = (
  error: unknown,
  message: string,
  errorCode: string,
): GraphQLError => {
  if (error instanceof GraphQLError) {
    return error;
  }

  const { status, message: originalMessage } = (error ?? {}) as OctokitError;

  return new GraphQLError(message, {
    extensions: {
      code: status === 404 ? 'NOT_FOUND' : errorCode,
      status,
      originalMessage,
    },
  });
};

export const isNotFound = (error: unknown): boolean => {
  return Boolean((error as OctokitError | undefined)?.status === 404);
};
