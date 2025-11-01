export type Environment = 'local';

export type Config = {
  readonly environment: Environment;
  readonly githubToken: string;
  readonly port: number;
  readonly frontendUrl: string;
  readonly repositoriesToFetch: string[];
};
