/**
 * Repository data transfer object
 */
export interface Repository {
  name: string;
  size: number;
  owner: string;
}

/**
 * Repository details data transfer object
 */
export interface RepositoryDetails extends Repository {
  isPrivate: boolean;
  fileCount: number;
  yamlSample: YamlSample | null;
  activeWebhooks: Webhook[];
}

/**
 * YAML sample data transfer object
 */
export interface YamlSample {
  path: string;
  content: string;
}

/**
 * Webhook data transfer object
 */
export interface Webhook {
  id: string;
  name: string;
  url: string;
}
