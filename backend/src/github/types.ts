export interface RepositoryIdentifier {
  owner: string;
  name: string;
}

export interface RepositorySummary {
  name: string;
  size: number;
  owner: string;
}

export interface YamlSample {
  path: string;
  content: string;
}

export interface ActiveWebhook {
  id: string;
  name: string | null;
  url: string | null;
}

export interface RepositoryDetails extends RepositorySummary {
  isPrivate: boolean;
  fileCount: number;
  yamlSample: YamlSample | null;
  activeWebhooks: ActiveWebhook[];
}

export const OCTOKIT_TOKEN = Symbol('OCTOKIT_TOKEN');
