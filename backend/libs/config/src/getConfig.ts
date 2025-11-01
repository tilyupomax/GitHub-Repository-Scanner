import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { cleanEnv } from 'envalid';

import { Config } from './config.types';
import { envSpecs } from './env-specs';

const myEnv = dotenv.config({ override: true });
dotenvExpand.expand(myEnv);

export const getConfig = (): Config => {
  const env = cleanEnv(process.env, envSpecs);

  return {
    environment: env.NODE_ENV,
    port: env.PORT,
    githubToken: env.GITHUB_TOKEN,
    frontendUrl: env.FRONTEND_URL,
    repositoriesToFetch: env.REPOSITORIES_TO_FETCH,
  };
};
