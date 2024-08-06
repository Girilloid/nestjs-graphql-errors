import { Catch } from '@nestjs/common';
import type { GqlExceptionFilter } from '@nestjs/graphql';

import { BaseGraphQLException, BaseGraphQLListException } from '../exceptions';
import type { ExtraBase, PlainException } from '../types';

export interface GraphQLExceptionFilterResult {
  readonly error: PlainException<string, ExtraBase> | readonly PlainException<string, ExtraBase>[];
}

/**
 * GraphQLException filter. Normalizes and builds GraphQL response.
 *
 * @example
 * ```ts
 * app.useGlobalFilters(new GraphQLExceptionFilter());
 * ```
 *
 * @class
 * @implements {GqlExceptionFilter}
 * @public
 */
@Catch(BaseGraphQLException, BaseGraphQLListException)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  /**
   * Processes caught GraphQLException.
   *
   * @param {BaseGraphQLException | BaseGraphQLListException} exception Caught GraphQLException.
   *
   * @returns {PlainException | PlainException[]} Normalized GraphQL response.
   */
  public catch(
    exception: BaseGraphQLException<string, ExtraBase> | BaseGraphQLListException,
  ): GraphQLExceptionFilterResult {
    return {
      error: exception.toPlain(),
    };
  }
}
