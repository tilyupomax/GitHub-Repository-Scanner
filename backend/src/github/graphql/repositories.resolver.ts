import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  RepositoryDetailsArgs,
  RepositoryDetailsDto,
  RepositorySummaryDto,
} from '../dtos';
import { GithubService } from '../services';

@Resolver()
export class RepositoriesResolver {
  constructor(private readonly githubService: GithubService) {}

  @Query(() => [RepositorySummaryDto])
  async repositories(): Promise<RepositorySummaryDto[]> {
    return this.githubService.getRepositoriesWithLimit();
  }

  @Query(() => RepositoryDetailsDto)
  async repositoryDetails(
    @Args() { name }: RepositoryDetailsArgs,
  ): Promise<RepositoryDetailsDto> {
    return this.githubService.fetchRepositoryDetails(name);
  }
}
