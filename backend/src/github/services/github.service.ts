import { getConfig } from '@app/config';
import { Inject, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { GraphQLError } from 'graphql';
import pLimit from 'p-limit';
import { asGraphQLError, isNotFound } from 'src/common/utils';
import {
  ActiveWebhook,
  OCTOKIT_TOKEN,
  RepositoryDetails,
  RepositorySummary,
  YamlSample,
} from '../types';
import { RepositoryWorkerService } from './repository-worker.service';

@Injectable()
export class GithubService {
  private readonly concurrencyLimiter = pLimit(2);
  private readonly config = getConfig();
  private ownerLoginPromise: Promise<string> | null = null;

  constructor(
    @Inject(OCTOKIT_TOKEN) private readonly octokit: Octokit,
    private readonly repositoryWorker: RepositoryWorkerService,
  ) {}

  async getRepositoriesWithLimit(): Promise<RepositorySummary[]> {
    const owner = await this.getAuthenticatedOwner();

    return Promise.all(
      this.config.repositoriesToFetch.map((name) =>
        this.concurrencyLimiter(() => this.fetchRepository(owner, name)),
      ),
    );
  }

  async fetchRepository(
    owner: string,
    name: string,
  ): Promise<RepositorySummary> {
    try {
      const repoResponse = await this.octokit.repos.get({ owner, repo: name });
      const repoData = repoResponse.data;
      let sizeInKilobytes = repoData.size ?? 0;

      try {
        const treeResponse = await this.octokit.git.getTree({
          owner,
          repo: name,
          tree_sha: 'HEAD',
          recursive: '1',
        });

        if (!treeResponse.data.truncated) {
          const { totalBytes } = await this.repositoryWorker.analyzeTree(
            treeResponse.data.tree,
          );
          const computedSize = Math.round(totalBytes / 1024);

          if (Number.isFinite(computedSize) && computedSize >= 0) {
            sizeInKilobytes = computedSize;
          }
        }
      } catch (treeError) {
        console.warn(
          `Unable to calculate precise size for ${owner}/${name}; falling back to GitHub reported size.`,
          treeError,
        );
      }

      return {
        name: repoData.name ?? name,
        size: sizeInKilobytes,
        owner: repoData.owner?.login ?? owner,
      };
    } catch (error) {
      throw asGraphQLError(
        error,
        'Failed to load repositories.',
        'GITHUB_API_ERROR',
      );
    }
  }

  async fetchRepositoryDetails(name: string): Promise<RepositoryDetails> {
    const owner = await this.getAuthenticatedOwner();

    try {
      const [repoResponse, treeResponse, hooksResponse] = await Promise.all([
        this.octokit.repos.get({ owner, repo: name }),
        this.octokit.git.getTree({
          owner,
          repo: name,
          tree_sha: 'HEAD',
          recursive: '1',
        }),
        this.octokit.repos.listWebhooks({ owner, repo: name, per_page: 100 }),
      ]);

      const repoData = repoResponse.data;
      const treeData = treeResponse.data;
      const webhookData = hooksResponse.data;

      if (treeData.truncated) {
        throw new GraphQLError(
          `Repository ${owner}/${name} tree is truncated; cannot determine file count. Try reducing repository size.`,
        );
      }

      const treeAnalysis = await this.repositoryWorker.analyzeTree(
        treeData.tree,
      );
      const computedSize = Math.round(treeAnalysis.totalBytes / 1024);
      const resolvedSize =
        Number.isFinite(computedSize) && computedSize >= 0
          ? computedSize
          : (repoData.size ?? 0);

      const yamlSample = await this.resolveYamlSample(
        owner,
        name,
        treeAnalysis.yamlPath,
      );
      const activeWebhooks = this.extractActiveWebhooks(webhookData);

      return {
        name: repoData.name ?? name,
        size: resolvedSize,
        owner: repoData.owner?.login ?? owner,
        isPrivate: repoData.private ?? false,
        fileCount: treeAnalysis.fileCount,
        yamlSample,
        activeWebhooks,
      };
    } catch (error) {
      throw asGraphQLError(
        error,
        `Unable to load repository details for ${owner}/${name}.`,
        'GITHUB_API_ERROR',
      );
    }
  }

  private async resolveYamlSample(
    owner: string,
    name: string,
    yamlPath: string | null,
  ): Promise<YamlSample | null> {
    if (!yamlPath) {
      return null;
    }

    try {
      const contentResponse = await this.octokit.repos.getContent({
        owner,
        repo: name,
        path: yamlPath,
      });

      const file = Array.isArray(contentResponse.data)
        ? null
        : contentResponse.data;

      if (!file || typeof file === 'string' || !('content' in file)) {
        return null;
      }

      const encodedContent = file.content;
      if (typeof encodedContent !== 'string') {
        return null;
      }

      const normalized =
        await this.repositoryWorker.normalizeYaml(encodedContent);

      if (normalized === null) {
        return null;
      }

      return {
        path: yamlPath,
        content: normalized,
      };
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }

      throw error;
    }
  }

  private extractActiveWebhooks(
    hooks: Array<{
      active?: boolean;
      id: number;
      name?: string;
      config?: Record<string, unknown>;
    }>,
  ): ActiveWebhook[] {
    return hooks
      .filter((hook) => hook.active)
      .map((hook) => ({
        id: String(hook.id),
        name: hook.name ?? null,
        url: typeof hook.config?.url === 'string' ? hook.config.url : null,
      }));
  }

  private async getAuthenticatedOwner(): Promise<string> {
    if (this.ownerLoginPromise) {
      return this.ownerLoginPromise;
    }

    const getAuthenticated =
      this.octokit.rest?.users.getAuthenticated?.bind(this.octokit) ??
      this.octokit.users?.getAuthenticated?.bind(this.octokit);

    if (!getAuthenticated) {
      throw new GraphQLError(
        'Octokit instance cannot resolve authenticated user.',
      );
    }

    this.ownerLoginPromise = getAuthenticated()
      .then(({ data }) => data.login)
      .catch((error) => {
        throw asGraphQLError(
          error,
          'Failed to determine repository owner from GitHub token.',
          'GITHUB_API_ERROR',
        );
      });

    if (!this.ownerLoginPromise) {
      throw new GraphQLError('Failed to resolve authenticated owner login.');
    }

    return this.ownerLoginPromise;
  }
}
