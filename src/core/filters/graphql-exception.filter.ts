import { Catch } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import type { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLList } from 'graphql';

import { BaseGraphQLException, BaseGraphQLListException } from '../exceptions';
import type { EnumLike, ExtraBase, PlainException } from '../types';

type ErrorType = PlainException<EnumLike | string, ExtraBase> | readonly PlainException<EnumLike | string, ExtraBase>[];

const isArrayErrorType = (host: ArgumentsHost): boolean => {
  const gqlContext = host.getArgByIndex(3);

  const errorType = gqlContext?.returnType?.ofType?._fields?.error?.type;

  return errorType instanceof GraphQLList;
};

const resolveError = (plainException: ErrorType, host: ArgumentsHost): ErrorType => {
  const arrayErrorType = isArrayErrorType(host);
  const arrayExceptionType = Array.isArray(plainException);

  if (arrayErrorType && !arrayExceptionType) {
    return [plainException] as ErrorType;
  }

  if (!arrayErrorType && arrayExceptionType) {
    const [error] = plainException;

    return error;
  }

  return plainException;
};

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
   * @param host Arguments host.
   *
   * @returns Normalized GraphQL response.
   */
  public catch(
    exception: BaseGraphQLException<EnumLike | string, ExtraBase> | BaseGraphQLListException,
    host: ArgumentsHost,
  ): GraphQLExceptionFilterResult {
    const plainException = exception.toPlain();

    const error = resolveError(plainException, host);

    return {
      error,
    };
  }
}
