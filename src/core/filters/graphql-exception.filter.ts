import { Catch } from '@nestjs/common';
import type { GqlExceptionFilter } from '@nestjs/graphql';

import { BaseGraphQLException, BaseGraphQLListException } from '../exceptions';
import type { EnumLike, ExtraBase, PlainException } from '../types';

export interface GraphQLExceptionFilterResult {
  readonly error:
    | PlainException<EnumLike | string, ExtraBase>
    | readonly PlainException<EnumLike | string, ExtraBase>[];
}

/**
 * GraphQLException filter. Normalizes and generates GraphQL response.
 *
 * @example
 * ```ts
 * app.useGlobalFilters(new GraphQLExceptionFilter());
 * ```
 *
 * @class
 * @public
 */
@Catch(BaseGraphQLException, BaseGraphQLListException)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  /**
   * Method for handling a caught GraphQLException subclass.
   *
   * @param exception Caught GraphQLException subclass.
   *
   * @returns Normalized GraphQL response.
   */
  public catch(
    exception: BaseGraphQLException<EnumLike | string, ExtraBase> | BaseGraphQLListException,
  ): GraphQLExceptionFilterResult {
    return {
      error: exception.toPlain(),
    };
  }
}
