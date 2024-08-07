import type { Type } from '@nestjs/common';
import { createUnionType } from '@nestjs/graphql';
import type { GqlTypeReference, Union } from '@nestjs/graphql';

/**
 * Factory to create a GraphQL union from an array of GraphQLErrors.
 *
 * @example
 * ```ts
 * const Union = graphqlErrorUnionFactory('Union', [GraphQLErrorOne, GraphQLErrorTwo]);
 * ```
 *
 * @param name Union name for GraphQL schema.
 * @param types An array of GraphQLErrors.
 *
 * @returns GraphQL union.
 *
 * @public
 */
export const graphqlErrorUnionFactory = (
  name: string,
  types: readonly Type<GqlTypeReference>[],
): Type<Union<readonly Type<GqlTypeReference>[]>> => {
  return createUnionType({
    name,
    /* istanbul ignore next */
    resolveType(value) {
      const { __typename } = value;

      return types.find((type) => {
        return type.name === __typename;
      });
    },
    types: /* istanbul ignore next */ () => types,
  }) as Type<Union<readonly Type<GqlTypeReference>[]>>;
};
