import { graphqlExceptionFactory } from 'nestjs-graphql-errors';

import { ItemProtectedError } from '../../presentation/error';

export const ItemProtectedException = graphqlExceptionFactory(ItemProtectedError);
