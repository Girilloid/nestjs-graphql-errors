import { graphqlErrorUnionFactory } from 'nestjs-graphql-errors';

import { ItemNotFoundError } from './item-not-found.error';
import { ItemProtectedError } from './item-protected.error';

export const ItemError = graphqlErrorUnionFactory('ItemError', [ItemNotFoundError, ItemProtectedError]);
