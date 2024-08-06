import { Field, ID, InputType } from '@nestjs/graphql';

@InputType('ItemsInput')
export class ItemsInput {
  @Field(() => [ID], {
    name: 'itemIds',
    nullable: false,
  })
  public readonly itemIds: readonly string[];
}
