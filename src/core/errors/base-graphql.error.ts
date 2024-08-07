import { Field, InterfaceType } from '@nestjs/graphql';

/**
 * Base class for all GraphQLError subclasses. Defines the GraphQL interface.
 *
 * @example
 * ```ts
 * ＠ObjectType({ implements: () => BaseGraphQLError })
 * class SomeGraphQLError {}
 * ```
 *
 * @abstract
 * @class
 * @public
 */
@InterfaceType({ isAbstract: true })
export abstract class BaseGraphQLError {
  /**
   * A nullable message for all GraphQLError subclasses.
   *
   * @public
   */
  @Field(() => String, {
    name: 'message',
    nullable: true,
  })
  public readonly message?: string;
}
