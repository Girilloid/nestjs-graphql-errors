import { graphqlErrorUnionFactory } from 'nestjs-graphql-errors';

import { ItemNotFoundError } from './item-not-found.error';
import { ItemProtectedError } from './item-protected.error';

export const ItemsError = graphqlErrorUnionFactory('ItemsError', [ItemNotFoundError, ItemProtectedError]);
