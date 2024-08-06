import type { ExtraBase, PlainException } from '../types';

import type { BaseGraphQLException } from './base-graphql.exception';

/**
 * Base class to throw an array of GraphQLExceptions.
 *
 * @example
 * ```ts
 * throw new BaseGraphQLListException(new SomeGraphQLException('SOME_CODE', 'Some message'));
 * ```
 *
 * @class
 * @implements {Error}
 * @public
 */
export class BaseGraphQLListException extends Error {
  /**
   * Array of GraphQLExceptions.
   *
   * @type {BaseGraphQLException[]}
   *
   * @public
   */
  public readonly errors: readonly BaseGraphQLException<string, ExtraBase>[];

  /**
   * Creates an instants of BaseGraphQLListException.
   *
   * @example
   * ```ts
   * new BaseGraphQLListException(new SomeGraphQLException('SOME_CODE', 'Some message'));
   * ```
   *
   * @param {...BaseGraphQLException[]} errors Array of GraphQLExceptions.
   *
   * @constructor
   * @public
   */
  constructor(...errors: readonly BaseGraphQLException<string, ExtraBase>[]) {
    super();

    this.errors = errors;
  }

  /**
   * Method to retrieve plain representation of GraphQLExceptions.
   *
   * @example
   * ```ts
   * const plainSomeGraphQLException =
   *   new BaseGraphQLListException(new SomeGraphQLException('SOME_CODE', 'Some message')).toPlain();
   * ```
   *
   * @returns Plain representation of GraphQLExceptions.
   *
   * @public
   */
  public toPlain(): PlainException<string, ExtraBase>[] {
    return this.errors.map((error) => {
      return error.toPlain();
    });
  }
}
