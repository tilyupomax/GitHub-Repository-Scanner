import { json, num, str } from 'envalid';

export const envSpecs = {
  NODE_ENV: str({
    desc: 'The environment in which the application is running',
    default: 'local',
    choices: ['local'],
  }),
  PORT: num({
    desc: 'The port the HTTP server listens on',
    default: 4200,
  }),
  GITHUB_TOKEN: str({
    desc: 'The GitHub personal access token used for API requests',
  }),
  FRONTEND_URL: str({
    desc: 'The origin allowed to access the API via CORS',
    default: 'http://localhost:3000',
  }),
  REPOSITORIES_TO_FETCH: json({
    desc: 'JSON array of repositories to include ("owner/name" or "name")',
    default: JSON.stringify([]),
  }),
};
