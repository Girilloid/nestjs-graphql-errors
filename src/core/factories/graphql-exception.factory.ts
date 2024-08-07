import type { Type } from '@nestjs/common';

import { BaseGraphQLException } from '../exceptions';
import type {
  GraphQLExceptionClass,
  ExtraBase,
  NotEmptyOrVoid,
  ExtraSanitized,
  EnumLike,
  EnumLikeValue,
} from '../types';

import type { GraphQLErrorType } from './graphql-error.factory';

/**
 * Creates a subclass of GraphQLException from the provided GraphQLError.
 *
 * @example
 * ```ts
 * const GraphQLException = graphqlExceptionFactory(SomeGraphQLError);
 * ```
 *
 * @param classRef GraphQLError reference.
 *
 * @returns Subclass of GraphQLException.
 *
 * @public
 */
export const graphqlExceptionFactory = <ErrorCode extends EnumLike | string, Extra extends ExtraBase>(
  classRef: Type<GraphQLErrorType<ErrorCode> & Extra>,
): GraphQLExceptionClass<BaseGraphQLException<ErrorCode, Extra>, ErrorCode, Extra> => {
  class Exception extends BaseGraphQLException<ErrorCode, Extra> {
    constructor(code: EnumLikeValue<ErrorCode>, message: string, extra: NotEmptyOrVoid<ExtraSanitized<Extra>>) {
      super(classRef.name, code, message || '', extra);
    }
  }

  return Exception;
};
