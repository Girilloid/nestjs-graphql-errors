import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig, ApolloDriverConfigFactory } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

import { ItemNotFoundErrorCode } from '../../modules/items/presentation/error';

@Injectable()
export class GraphQLConfigService implements ApolloDriverConfigFactory {
  public createGqlOptions(): Omit<ApolloDriverConfig, 'driver'> {
    registerEnumType(ItemNotFoundErrorCode, { name: 'ItemNotFoundErrorCode' });

    return {
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    };
  }
}
