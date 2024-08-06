/* eslint-disable max-classes-per-file */

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { GraphQLResult } from './graphql-result.factory';

@ObjectType('Dto')
class Dto {
  @Field(() => ID, {
    name: 'id',
    nullable: false,
  })
  public readonly id: string;
}

@ObjectType('Error')
class Error {
  @Field(() => ID, {
    name: 'id',
    nullable: false,
  })
  public readonly id: string;
}

// It expects `dataClassRef` and `errorClassRef` to be GqlTypeReference or GqlTypeReference[]
@ObjectType('ResultFirst')
// @ts-expect-error
class _ResultFirst extends GraphQLResult(1, 1) {}

// It expects `dataClassRef` and `errorClassRef` to be GqlTypeReference or GqlTypeReference[]
@ObjectType('ResultSecond')
class ResultSecond extends GraphQLResult(Dto, Error) {}

// It expects `dataClassRef` and `errorClassRef` to be GqlTypeReference or GqlTypeReference[]
@ObjectType('ResultThird')
class ResultThird extends GraphQLResult([Dto], Error) {}

// It expects `dataClassRef` and `errorClassRef` to be GqlTypeReference or GqlTypeReference[]
@ObjectType('ResultFourth')
class ResultFourth extends GraphQLResult(Dto, [Error]) {}

// It expects `dataClassRef` and `errorClassRef` to be GqlTypeReference or GqlTypeReference[]
@ObjectType('ResultFifth')
class ResultFifth extends GraphQLResult([Dto], [Error]) {}

const resultSecond = new ResultSecond();

// Data field should be Dto
const _resultSecondData_: Dto = resultSecond.data;

// Data field should be Dto
// @ts-expect-error
const _resultSecondData__: Dto[] = resultSecond.data;

// Error field should be Error
const _resultSecondError_: Error = resultSecond.error;

// Error field should be Error
// @ts-expect-error
const _resultSecondError__: Error[] = resultSecond.error;

const resultThird = new ResultThird();

// Data field should be Dto[]
// @ts-expect-error
const _resultThirdData_: Dto = resultThird.data;

// Data field should be Dto[]
const _resultThirdData__: Dto[] = resultThird.data;

// Error field should be Error
const _resultThirdError_: Error = resultThird.error;

// Error field should be Error
// @ts-expect-error
const _resultThirdError__: Error[] = resultThird.error;

const resultFourth = new ResultFourth();

// Data field should be Dto
const _resultFourthData_: Dto = resultFourth.data;

// Data field should be Dto
// @ts-expect-error
const _resultFourthData__: Dto[] = resultFourth.data;

// Error field should be Error[]
// @ts-expect-error
const _resultFourthError_: Error = resultFourth.error;

// Error field should be Error[]
const _resultFourthError__: Error[] = resultFourth.error;

const resultFifth = new ResultFifth();

// Data field should be Dto[]
// @ts-expect-error
const _resultFifthData_: Dto = resultFifth.data;

// Data field should be Dto[]
const _resultFifthData__: Dto[] = resultFifth.data;

// Error field should be Error[]
// @ts-expect-error
const _resultFifthError_: Error = resultFifth.error;

// Error field should be Error[]
const _resultFifthError__: Error[] = resultFifth.error;

describe('GraphQLResult', () => {
  it('passes TypeScript check', () => {
    expect(true).toBeTruthy();
  });

  it('returns Result class', () => {
    const result = new ResultSecond();

    expect(result).toBeTruthy();
  });
});
