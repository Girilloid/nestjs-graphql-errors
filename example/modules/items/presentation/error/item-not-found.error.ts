import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLError } from 'nestjs-graphql-errors';

export enum ItemNotFoundErrorCode {
  ITEM_NOT_FOUND,
}

@ObjectType('ItemNotFoundError')
export class ItemNotFoundError extends GraphQLError(ItemNotFoundErrorCode) {
  @Field(() => ID, {
    name: 'itemId',
    nullable: false,
  })
  public readonly itemId: string;
}
