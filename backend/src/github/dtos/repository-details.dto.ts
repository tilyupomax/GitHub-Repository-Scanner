import { Field, ObjectType } from '@nestjs/graphql';
import { RepositorySummaryDto } from './repository-summary.dto';
import { WebhookDto } from './webhook.dto';
import { YamlSampleDto } from './yaml-sample.dto';

@ObjectType('RepositoryDetails')
export class RepositoryDetailsDto extends RepositorySummaryDto {
  @Field()
  isPrivate!: boolean;

  @Field()
  fileCount!: number;

  @Field(() => YamlSampleDto, { nullable: true })
  yamlSample!: YamlSampleDto | null;

  @Field(() => [WebhookDto])
  activeWebhooks!: WebhookDto[];
}
