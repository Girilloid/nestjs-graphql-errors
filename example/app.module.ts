import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLErrorsModule } from 'nestjs-graphql-errors';

import { GraphQLConfigService } from './config/graphql';
import { ItemsModule } from './modules/items';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useClass: GraphQLConfigService,
    }),
    GraphQLErrorsModule,
    ItemsModule,
  ],
})
export class AppModule {}
