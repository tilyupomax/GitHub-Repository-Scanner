import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class YamlSampleDto {
  @Field()
  path!: string;

  @Field()
  content!: string;
}
