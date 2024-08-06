import { Field, ID, InputType } from '@nestjs/graphql';

@InputType('ItemInput')
export class ItemInput {
  @Field(() => ID, {
    name: 'itemId',
    nullable: false,
  })
  public readonly itemId: string;
}
