import { getConfig } from '@app/config';
import { Module } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { RepositoriesResolver } from './graphql';
import { GithubService, RepositoryWorkerService } from './services';
import { OCTOKIT_TOKEN } from './types';

@Module({
  providers: [
    {
      provide: OCTOKIT_TOKEN,
      useFactory: () => {
        const config = getConfig();

        return new Octokit({
          auth: config.githubToken,
        });
      },
    },
  RepositoryWorkerService,
  GithubService,
    RepositoriesResolver,
  ],
  exports: [GithubService],
})
export class GithubModule {}
