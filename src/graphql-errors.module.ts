import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GraphQLExceptionFilter } from './core/filters';

/**
 * GraphQLErrors module. Provides global GraphQLException filter.
 *
 * @example
 * ```ts
 * ＠Module({ imports: [GraphQLErrorsModule ]})
 * class SomeModule {}
 * ```
 *
 * @class
 * @public
 */
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
})
export class GraphQLErrorsModule {}
