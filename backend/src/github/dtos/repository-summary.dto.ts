import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Repository')
export class RepositorySummaryDto {
  @Field()
  name!: string;

  @Field()
  owner!: string;

  @Field()
  size!: number;
}
