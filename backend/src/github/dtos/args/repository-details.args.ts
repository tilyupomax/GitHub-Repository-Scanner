import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RepositoryDetailsArgs {
  @Field()
  name!: string;
}
