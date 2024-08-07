/* eslint-disable @typescript-eslint/no-explicit-any */

import type { EnumLike, PlainException } from '../types';

import type { BaseGraphQLException } from './base-graphql.exception';

/**
 * Base class to throw an array of the GraphQLExceptions.
 *
 * @example
 * ```ts
 * throw new BaseGraphQLListException(new SomeGraphQLException('SOME_CODE', 'Some message'));
 * ```
 *
 * @class
 * @public
 */
export class BaseGraphQLListException extends Error {
  /**
   * Array of GraphQLExceptions.
   *
   * @public
   */
  public readonly errors: readonly BaseGraphQLException<EnumLike | string, any>[];

  /**
   * Creates an instance of BaseGraphQLListException.
   *
   * @example
   * ```ts
   * new BaseGraphQLListException(new SomeGraphQLException('SOME_CODE', 'Some message'));
   * ```
   *
   * @param errors An array of GraphQLExceptions.
   *
   * @constructor
   * @public
   */
  constructor(...errors: readonly BaseGraphQLException<EnumLike | string, any>[]) {
    super();

    this.errors = errors;
  }

  /**
   * Method for getting a simple representation of GraphQLExceptions.
   *
   * @example
   * ```ts
   * const plainSomeGraphQLException =
   *   new BaseGraphQLListException(new SomeGraphQLException('SOME_CODE', 'Some message')).toPlain();
   * ```
   *
   * @returns Simple representation of GraphQLExceptions.
   *
   * @public
   */
  public toPlain(): PlainException<EnumLike | string, any>[] {
    return this.errors.map((error) => {
      return error.toPlain();
    });
  }
}
