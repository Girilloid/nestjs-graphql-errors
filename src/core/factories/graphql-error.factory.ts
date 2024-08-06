import type { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import type { GqlTypeReference } from '@nestjs/graphql';

import { BaseGraphQLError } from '../errors';

export interface GraphQLErrorType<T extends object | string> {
  readonly code: T;
  readonly message?: string;
}

const getClassRef = <T extends object | string>(classRef?: T): GqlTypeReference => {
  if (!classRef || typeof classRef === 'string') {
    return String;
  }

  return classRef;
};

/**
 * Base class to create GraphQLError.
 *
 * @example
 * ```ts
 * ＠ObjectType('SomeGraphQLError')
 * class SomeGraphQLError extends GraphQLError {
 *   ＠Field(() => ID, { name: 'id', nullable: false })
 *   public readonly id: string;
 * }
 * ```
 *
 * @template T
 *
 * @param {T=} classRef Enum or string to provide `code` type reference.
 *
 * @returns {GqlTypeReference} GraphQLError.
 *
 * @implements {BaseGraphQLError}
 * @public
 */
export const GraphQLError = <T extends object | string>(classRef?: T): Type<GraphQLErrorType<T>> => {
  @ObjectType({
    implements: () => BaseGraphQLError,
    isAbstract: true,
  })
  class _GraphQLError implements BaseGraphQLError {
    @Field(() => getClassRef(classRef), {
      name: 'code',
      nullable: false,
    })
    public readonly code: T;

    public readonly message?: string;
  }

  return _GraphQLError;
};
