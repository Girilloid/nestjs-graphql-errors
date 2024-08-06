import { BaseGraphQLException } from '../exceptions';
import type { GraphQLExceptionClass, ExtraBase, NotEmptyOrVoid, ExtraSanitized } from '../types';

/**
 * Creates GraphQLException from provided GraphQLError.
 *
 * @example
 * ```ts
 * const GraphQLException = graphqlExceptionFactory(SomeGraphQLError);
 * ```
 *
 * @template ErrorCode
 * @template Extra
 *
 * @param {GraphQLExceptionClass<ErrorCode, Extra>} classRef GraphQLError reference.
 * @returns {GraphQLExceptionClass<ErrorCode, Extra>} GraphQLException.
 *
 * @public
 */
export const graphqlExceptionFactory = <ErrorCode extends number | string, Extra extends ExtraBase>(
  classRef: GraphQLExceptionClass<Extra, ErrorCode, Extra>,
): GraphQLExceptionClass<BaseGraphQLException<ErrorCode, Extra>, ErrorCode, Extra> => {
  class Exception extends BaseGraphQLException<ErrorCode, Extra> {
    constructor(code: ErrorCode, message: string, extra: NotEmptyOrVoid<ExtraSanitized<Extra>>) {
      super(classRef.name, code, message || '', extra);
    }
  }

  return Exception;
};
