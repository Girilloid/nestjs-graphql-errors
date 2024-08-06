/* eslint-disable max-classes-per-file */

import { ObjectType } from '@nestjs/graphql';
import type { GqlTypeReference } from '@nestjs/graphql';

import { graphqlErrorUnionFactory } from './graphql-error-union.factory';
import { GraphQLError } from './graphql-error.factory';

@ObjectType('ErrorSecond')
class ErrorFirst extends GraphQLError() {}

@ObjectType('ErrorFirst')
class ErrorSecond extends GraphQLError() {}

// It should expect `types` to present
// @ts-expect-error
graphqlErrorUnionFactory('Union');

// It should expect `types` to be an array of GqlTypeReference
// @ts-expect-error
graphqlErrorUnionFactory('Union', ErrorFirst);

// It should expect `types` to be an array of GqlTypeReference
// @ts-expect-error
graphqlErrorUnionFactory('Union', [1]);

// It should expect `types` to be an array of GqlTypeReference
graphqlErrorUnionFactory('Union', [ErrorFirst]);

// It should expect `types` to be an array of GqlTypeReference
// @ts-expect-error
graphqlErrorUnionFactory('Union', [ErrorFirst, 1]);

// It should expect `types` to be an array of GqlTypeReference
graphqlErrorUnionFactory('Union', [ErrorFirst, ErrorSecond]);

describe('graphqlErrorUnionFactory', () => {
  it('passes TypeScript check', () => {
    expect(true).toBeTruthy();
  });

  it('returns error union', () => {
    const result: GqlTypeReference = graphqlErrorUnionFactory('Union', [ErrorFirst, ErrorSecond]);

    expect(result).toBeTruthy();
  });
});
