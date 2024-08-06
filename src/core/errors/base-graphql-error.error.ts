import { Field, InterfaceType } from '@nestjs/graphql';

/**
 * Base class for all the GraphQLError subclasses. Defines GraphQL interface.
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
   * Nullable message for all the GraphQLError subclasses.
   *
   * @type {?string}
   */
  @Field(() => String, {
    name: 'message',
    nullable: true,
  })
  public readonly message?: string;
}
