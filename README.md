# nestjs-graphql-errors

## Description

This library provides a set of utilities to build a **code-first**, type-safe GraphQL API with NestJS using error as data approach. By default, NestJS uses the default GraphQL way to expose application errors to clients. This mechanism is difficult to parse, hard to differentiate, and not typed in the GraphQL schema. Because of this, it's not unusual to handle errors as data.

## Install

```sh
npm install nestjs-graphql-errors
```

or

```sh
yarn install nestjs-graphql-errors
```

or

```sh
pnpm install nestjs-graphql-errors
```

## Usage

Library uses the following concepts:

- `GraphQLExceptionFilter`;
- `GraphQLError`;
- `GraphQLError` union;
- `GraphQLResult`;
- `GraphQLException`.

### GraphQLExceptionFilter

Any `GraphQLException` is a subclass of `BaseGraphQLException` (or `BaseGraphQLListException` to deal with a list of exceptions).

To override the default NestJS way of handling exceptions, we need to provide our own `ExceptionFilter`. Under the hood, `GraphQLExceptionFilter` catches any subclass of `BaseGraphQLException` or `BaseGraphQLListException` and transforms exception data to an acceptable format.

The library exports a helper module, `GraphQLErrorsModule`, if it's more appropriate to just import the module with a global ExceptionFilter.

```ts filename="modules/some/some.module.ts"
import { Module } from '@nestjs/common';
import { GraphQLErrorsModule } from 'nests-graphql-errors';

@Module({
  imports: [GraphQLErrorsModule]
})
export class SomeModule {}
```

The library also exports `GraphQLExceptionFilter` itself.

A global-scoped filter can be registered as a provider.

```ts filename="modules/some/some.module.ts"
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from 'nests-graphql-errors';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    }
  ]
})
export class SomeModule {}
```

Or outside of any module via `useGlobalFilters`.

```ts filename="main.ts"
import { NestFactory } from '@nestjs/core';
import { GraphQLExceptionFilter } from 'nestjs-graphql-errors';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GraphQLExceptionFilter());

  await app.listen(3000);
}

bootstrap();
```

Usage of resolver-scoped filter.

```ts filename="modules/some/presentation/some.resolver.ts"
import { UseFilters } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { GraphQLExceptionFilter } from 'nestjs-graphql-errors';

@UseFilters(new GraphQLExceptionFilter())
@Resolver()
export class SomeResolver {}
```

Method-scoped filter.

```ts filename="modules/some/presentation/some.resolver.ts"
import { UseFilters } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GraphQLExceptionFilter } from 'nestjs-graphql-errors';

import { SomeResult } from './result/some.result.ts'

@Resolver()
export class SomeResolver {
  ...

  @UseFilters(GraphQLExceptionFilter)
  @Query(() => SomeResult, {
    name: 'some',
    nullable: false
  })
  public async some(): Promise<SomeResult> {
    ...
  }

  ...
}
```

### GraphQLError

`GraphQLError` is a special `ObjectType` that implements `BaseGraphQLError` interface.

Every `GraphQLError` has two default fields:

- `message`. A nullable string field that describes the error;
- `code`. A non-nullable field, either a string or an enum, serving as the error descriptor.

When a custom `GraphQLError` extends `GraphQLError` without arguments, the `code` type defaults to string.

```ts filename="modules/some/presentation/error/some.error.ts"
import { ObjectType } from '@nestjs/graphql';
import { GraphQLError } from 'nestjs-graphql-errors';

@ObjectType('SomeError')
export class SomeError extends GraphQLError() {}
```

`GraphQLError` can be called with an enum argument. In such cases, the same enum will be used as the field type.

```ts filename="modules/some/presentation/error/some.error.ts"
import { ObjectType } from '@nestjs/graphql';
import { GraphQLError } from 'nestjs-graphql-errors';

export enum SomeErrorCode {
  ANOTHER_ERROR_CODE,
  SOME_ERROR_CODE,
}

@ObjectType('SomeError')
export class SomeError extends GraphQLError(SomeErrorCode) {}
```

Do not forget to register the enum.

```ts
...

import { registerEnumType } from '@nestjs/graphql';

import { SomeErrorCode } from '...';

...

registerEnumType(SomeErrorCode, { name: 'SomeErrorCode' });

...
```

Any additional fields defined in a custom `GraphQLError` will be used as extra fields for a corresponding `GraphQLException`.

```ts filename="modules/some/presentation/error/some.error.ts"
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLError } from 'nestjs-graphql-errors';

@ObjectType('SomeError')
export class SomeError extends GraphQLError() {
  @Field(() => ID, {
    name: 'someId',
    nullable: false
  })
  public readonly someId: string;
}
```

### GraphQLError union

Sometimes `GraphQLResult` is expected to have single error of a union type. Define such unions with a help of `graphqlErrorUnionFactory`.

```ts filename="modules/some/presentation/error/union.error.ts"
import { graphqlErrorUnionFactory } from 'nestjs-graphql-errors';

import { AnotherError } from './another.error.ts';
import { SomeError } from './some.error.ts';

export const UnionError = graphqlErrorUnionFactory('UnionError', [AnotherError, SomeError]);
```

### GraphQLResult

`GraphQLExceptionFilter` expects the response type to have the following definition when any `GraphQLException` is caught:

```graphql
...

type OperationResult {
  data: OperationDto
  error: OperationError
}

...

```

The library provides a base `GraphQLResult` type to avoid boilerplate code.

`GraphQLResult` requires data and error class references.

```ts filename="modules/some/presentation/result/some.result.ts"
import { ObjectType } from '@nestjs/graphql';
import { GraphQLResult } from 'nestjs-graphql-errors';

import { SomeDto } from '../dto/some.dto.ts';
import { UnionError } from '../error/union.error.ts';

@ObjectType('SomeResult')
export class SomeResult extends GraphQLResult(SomeDto, UnionError);
```

They can reference an array as well.

```ts filename="modules/some/presentation/result/some.result.ts"
import { ObjectType } from '@nestjs/graphql';
import { GraphQLResult } from 'nestjs-graphql-errors';

import { SomeDto } from '../dto/some.dto.ts';
import { UnionError } from '../error/union.error.ts';

@ObjectType('SomeResult')
export class SomeResult extends GraphQLResult([SomeDto], [UnionError]);
```

### GraphQLException

`GraphQLException` is created based on the `GraphQLError` reference. It allows us to infer the `code` field type and any extra fields.

```ts filename="modules/some/core/exceptions/some.exception.ts"
import { graphqlExceptionFactory } from 'nestjs-graphql-errors';

import { SomeError } from '../../presentation/error';

export const SomeException = graphqlExceptionFactory(SomeError);
```

`GraphQLException` without extra fields.

```ts filename="modules/some/application/some.service.ts"
...

import { SomeException } from '../core/exceptions';

...

throw new SomeException('SOME_ERROR_CODE', 'Some error message');

...
```

`GraphQLException` with extra fields (required argument).

```ts filename="modules/some/application/some.service.ts"
...

import { SomeException } from '../core/exceptions';

...

throw new SomeException('SOME_ERROR_CODE', 'Some error message', { someId: 'id' });

...
```

`GraphQLException` with an enum value as a code (inferred type).

```ts filename="modules/some/application/some.service.ts"
...

import { SomeException } from '../core/exceptions';

import { SomeErrorCode } from '../presentation/error';

...

throw new SomeException(SomeErrorCode.SOME_ERROR_CODE, 'Some error message');

...
```

`BaseGraphQLListException` is intended to be used in cases where a GraphQL operation may return multiple errors.

Exception constructor accepts variable length arguments.

```ts filename="modules/some/application/some.service.ts"
...

import { BaseGraphQLListException } from 'nestjs-graphql-errors';

import { SomeException } from '../core/exceptions';

...

throw new BaseGraphQLListException(
  new SomeException('SOME_ERROR_CODE', 'Some error message'),
  new SomeException('SOME_ERROR_CODE', 'Some error message'),
  new SomeException('SOME_ERROR_CODE', 'Some error message'),
);

...
```

### Resulting schema

Example of resulting GraphQL schema.

```graphql filename="schema.gql"
type Query {
  some(input: SomeInput!): SomeResult!
}

type SomeDto {
  id: ID!
}

interface BaseGraphQLError {
  message: String
}

enum SomeErrorCode {
  ANOTHER_ERROR_CODE
  SOME_ERROR_CODE
}

type AnotherError implements BaseGraphQLError {
  message: String
  code: String!
}

type SomeError implements BaseGraphQLError {
  message: String
  code: SomeErrorCode!
  someId: ID!
}

union UnionError = AnotherError | SomeError

type SomeResult {
  data: SomeDto
  error: UnionError
}
```

```graphql filename="query.graphql"
query ($input: SomeInput!) {
  some(input: $input) {
    data {
      id
    }
    error {
      ... on AnotherError {
        anotherErrorCode: code
        message
      }
      ... on SomeError {
        someErrorCode: code
        message
        someId
      }
    }
  }
}
```
