import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLError } from 'nestjs-graphql-errors';

@ObjectType('ItemProtectedError')
export class ItemProtectedError extends GraphQLError() {
  @Field(() => ID, {
    name: 'itemId',
    nullable: false,
  })
  public readonly itemId: string;
}
