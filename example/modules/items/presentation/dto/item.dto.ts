import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Item')
export class ItemDto {
  @Field(() => ID, {
    name: 'id',
    nullable: false,
  })
  public readonly id: string;

  @Field(() => Boolean, {
    name: 'protected',
    nullable: false,
  })
  public readonly protected: boolean;
}
