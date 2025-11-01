import { Config } from '../config.types';

export const localEnv: Config = {
  environment: 'local',
  port: parseInt(process.env.PORT || '4200', 10),
  githubToken: process.env.GITHUB_TOKEN ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  repositoriesToFetch: process.env.REPOSITORIES_TO_FETCH
    ? JSON.parse(process.env.REPOSITORIES_TO_FETCH)
    : [],
};

export default localEnv;
