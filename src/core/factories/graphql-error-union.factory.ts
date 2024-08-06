import type { Type } from '@nestjs/common';
import { createUnionType } from '@nestjs/graphql';
import type { GqlTypeReference, Union } from '@nestjs/graphql';

/**
 * Factory to create GraphQL union from array of GraphQLErrors.
 *
 * @example
 * ```ts
 * const Union = graphqlErrorUnionFactory('Union', [GraphQLErrorOne, GraphQLErrorTwo]);
 * ```
 *
 * @param {string} name Union name for GraphQL schema.
 * @param {Type<GqlTypeReference>[]} types Array of GraphQLErrors.
 *
 * @returns {Type<Union>} GraphQL union.
 *
 * @public
 */
export const graphqlErrorUnionFactory = (
  name: string,
  types: readonly Type<GqlTypeReference>[],
): Type<Union<readonly Type<GqlTypeReference>[]>> => {
  return createUnionType({
    name,
    resolveType(value) {
      const { __typename } = value;

      return types.find((type) => {
        return type.name === __typename;
      });
    },
    types: () => types,
  }) as Type<Union<readonly Type<GqlTypeReference>[]>>;
};
