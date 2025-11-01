import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Webhook')
export class WebhookDto {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => String, { nullable: true })
  url!: string | null;
}
