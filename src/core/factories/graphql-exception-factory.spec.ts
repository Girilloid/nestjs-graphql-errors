/* eslint-disable max-classes-per-file */

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { GraphQLError } from './graphql-error.factory';
import { graphqlExceptionFactory } from './graphql-exception.factory';

class Dummy {}

@ObjectType('ErrorFirst')
class ErrorFirst extends GraphQLError() {}

@ObjectType('ErrorSecond')
class ErrorSecond extends GraphQLError() {
  @Field(() => ID, {
    name: 'id',
    nullable: false,
  })
  public readonly id: string;
}

// It expects `classRef` to be like GraphQLExceptionClass
// @ts-expect-error
graphqlExceptionFactory(1);

// It expects `classRef` to be like GraphQLExceptionClass
// @ts-expect-error
graphqlExceptionFactory({});

// It expects `classRef` to be like GraphQLExceptionClass
// @ts-expect-error
graphqlExceptionFactory(Dummy);

// It expects `classRef` to be like GraphQLExceptionClass
const _ExceptionFirst = graphqlExceptionFactory(ErrorFirst);

// It expects to not have extra
// @ts-expect-error
new _ExceptionFirst('code', 'message', {});

// It expects to not have extra
new _ExceptionFirst('code', 'message');

// It expects `classRef` to be like GraphQLExceptionClass
const _ExceptionSecond = graphqlExceptionFactory(ErrorSecond);

// It expects to have correct extra
// @ts-expect-error
new _ExceptionSecond('code', 'message');

// It expects to have correct extra
// @ts-expect-error
new _ExceptionSecond('code', 'message', {});

// It expects to have correct extra
// @ts-expect-error
new _ExceptionSecond('code', 'message', { value: 'value' });

// It expects to have correct extra
new _ExceptionSecond('code', 'message', { id: 'id' });

describe('graphqlExceptionFactory', () => {
  it('passes TypeScript check', () => {
    expect(true).toBeTruthy();
  });

  it('returns subclass of BaseGraphQLException', () => {
    const Exception = graphqlExceptionFactory(ErrorFirst);

    expect(Exception).toBeTruthy();
  });
});
