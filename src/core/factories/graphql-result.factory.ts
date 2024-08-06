import type { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import type { GqlTypeReference } from '@nestjs/graphql';

type InferTypeFromType<T> = T extends Type<infer P> ? P : T;

type InferTypeFromArray<T> = T extends (infer P)[] ? InferTypeFromType<P>[] : InferTypeFromType<T>;

export interface GraphQLResultType<
  Data extends GqlTypeReference,
  Error extends GqlTypeReference,
  DataUnion extends Data | readonly Data[],
  ErrorUnion extends Error | readonly Error[],
> {
  readonly data?: InferTypeFromArray<DataUnion>;
  readonly error?: InferTypeFromArray<ErrorUnion>;
}

/**
 * Base class to create GraphQLResult from data and error references.
 *
 * @example
 * ```ts
 * ＠ObjectType('SomeGraphQLResult')
 * class SomeGraphQLResult extends GraphQLResult(GraphQLData, GraphQLError);
 * ```
 *
 * @template Data
 * @template Error
 * @template DataUnion
 * @template ErrorUnion
 *
 * @param {GqlTypeReference | GqlTypeReference[]} dataClassRef GraphQL data class reference.
 * @param {GqlTypeReference | GqlTypeReference[]} errorClassRef GraphQLError class reference.
 *
 * @returns {GqlTypeReference} GraphQLResult.
 *
 * @public
 */
export const GraphQLResult = <
  Data extends GqlTypeReference,
  Error extends GqlTypeReference,
  DataUnion extends Data | readonly Data[],
  ErrorUnion extends Error | readonly Error[],
>(
  dataClassRef: DataUnion,
  errorClassRef: ErrorUnion,
): Type<GraphQLResultType<Data, Error, DataUnion, ErrorUnion>> => {
  @ObjectType({ isAbstract: true })
  class _GraphQLResult {
    @Field(() => dataClassRef as GqlTypeReference, {
      name: 'data',
      nullable: true,
    })
    public readonly data?: InferTypeFromArray<DataUnion>;

    @Field(() => errorClassRef as GqlTypeReference, {
      name: 'error',
      nullable: true,
    })
    public readonly error?: InferTypeFromArray<ErrorUnion>;
  }

  return _GraphQLResult;
};
