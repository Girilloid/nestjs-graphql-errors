/* eslint-disable max-classes-per-file */

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { getClassRef, GraphQLError } from './graphql-error.factory';

enum ErrorCode {
  CODE,
}

// It should expect `classRef` to be string, enum or undefined
@ObjectType('ErrorFirst')
class ErrorFirst extends GraphQLError() {
  @Field(() => ID, {
    name: 'id',
    nullable: false,
  })
  public readonly id: string;
}

// It should expect `classRef` to be string, enum or undefined
@ObjectType('ErrorSecond')
class ErrorSecond extends GraphQLError('code') {}

// It should expect `classRef` to be string, enum or undefined
@ObjectType('ErrorThird')
class _ErrorThird extends GraphQLError(ErrorCode) {}

// It should expect `classRef` to be string, enum or undefined
@ObjectType('ErrorFourth')
// @ts-expect-error
class _ErrorFourth extends GraphQLError(1) {}

const errorFirst = new ErrorFirst();

// Extra field should be present
const _errorFirstId_ = errorFirst.id;

// Extra field should be string
const _errorFirstId__: string = errorFirst.id;

// Extra field should be string
// @ts-expect-error
const _errorFirstId___: number = errorFirst.id;

const errorSecond = new ErrorSecond();

// Extra field should not be present
// @ts-expect-error
const _errorSecondId = errorSecond.id;

describe('GraphQLError', () => {
  it('passes TypeScript check', () => {
    expect(true).toBeTruthy();
  });

  it('returns subclass of BaseGraphQLError', () => {
    const error = new ErrorFirst();

    expect(error).toBeTruthy();
  });
});

describe('getClassRef', () => {
  it('returns String classRef for missing input classRef', () => {
    const result = getClassRef();

    expect(result).toEqual(String);
  });

  it('returns String classRef for string input classRef', () => {
    const result = getClassRef('code');

    expect(result).toEqual(String);
  });

  it('returns enum classRef for enum input classRef', () => {
    const result = getClassRef(ErrorCode);

    expect(result).toEqual(ErrorCode);
  });
});
