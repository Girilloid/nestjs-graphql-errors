/* eslint-disable max-classes-per-file */

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { GraphQLError } from './graphql-error.factory';
import { graphqlExceptionFactory } from './graphql-exception.factory';

class Dummy {}

enum Code {
  CODE,
}

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

@ObjectType('ErrorThird')
class ErrorThird extends GraphQLError(Code) {}

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
const ExceptionFirst = graphqlExceptionFactory(ErrorFirst);

// It expects to not have extra
// @ts-expect-error
new ExceptionFirst('code', 'message', {});

// It expects to not have extra
new ExceptionFirst('code', 'message');

// It expects `classRef` to be like GraphQLExceptionClass
const ExceptionSecond = graphqlExceptionFactory(ErrorSecond);

// It expects to have correct extra
// @ts-expect-error
new ExceptionSecond('code', 'message');

// It expects to have correct extra
// @ts-expect-error
new ExceptionSecond('code', 'message', {});

// It expects to have correct extra
// @ts-expect-error
new ExceptionSecond('code', 'message', { value: 'value' });

// It expects to have correct extra
new ExceptionSecond('code', 'message', { id: 'id' });

// It expects `classRef` to be like GraphQLExceptionClass
const ExceptionThird = graphqlExceptionFactory(ErrorThird);

// It expects `code` to be enum value
// @ts-expect-error
new ExceptionThird('code', 'message');

// It expects `code` to be enum value
new ExceptionThird(Code.CODE, 'message');

describe('graphqlExceptionFactory', () => {
  it('passes TypeScript check', () => {
    expect(true).toBeTruthy();
  });

  it('returns subclass of BaseGraphQLException, subclass creates error with provided message', () => {
    const Exception = graphqlExceptionFactory(ErrorFirst);

    expect(Exception).toBeTruthy();

    const exception = new Exception('code', 'message');

    expect(exception).toBeInstanceOf(Error);

    const plainException = exception.toPlain();

    expect(plainException).toEqual({
      __typename: 'ErrorFirst',
      code: 'code',
      message: 'message',
    });
  });

  it('returns subclass of BaseGraphQLException, subclass creates error without provided message', () => {
    const Exception = graphqlExceptionFactory(ErrorFirst);

    expect(Exception).toBeTruthy();

    const exception = new Exception('code', null);

    expect(exception).toBeInstanceOf(Error);

    const plainException = exception.toPlain();

    expect(plainException).toEqual({
      __typename: 'ErrorFirst',
      code: 'code',
      message: '',
    });
  });
});
