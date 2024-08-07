import type { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import type { GqlTypeReference } from '@nestjs/graphql';

import { BaseGraphQLError } from '../errors';
import { EnumLike } from '../types';

export interface GraphQLErrorType<T extends EnumLike | string> {
  readonly code: T;
  readonly message?: string;
}

export const getClassRef = <T extends EnumLike | string>(classRef?: T): GqlTypeReference => {
  if (!classRef || typeof classRef === 'string') {
    return String;
  }

  return classRef;
};

/**
 * Base class for creating GraphQLError.
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
 * @param classRef An enum or string to specify a reference to the `code` type.
 *
 * @returns Subclass of GraphQLError.
 *
 * @public
 */
export const GraphQLError = <T extends EnumLike | string>(classRef?: T): Type<GraphQLErrorType<T>> => {
  @ObjectType({
    implements: /* istanbul ignore next */ () => BaseGraphQLError,
    isAbstract: true,
  })
  class _GraphQLError implements BaseGraphQLError {
    @Field(/* istanbul ignore next */ () => getClassRef(classRef), {
      name: 'code',
      nullable: false,
    })
    public readonly code: T;

    public readonly message?: string;
  }

  return _GraphQLError;
};
