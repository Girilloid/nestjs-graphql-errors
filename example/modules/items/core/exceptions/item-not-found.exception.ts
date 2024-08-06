import { graphqlExceptionFactory } from 'nestjs-graphql-errors';

import { ItemNotFoundError } from '../../presentation/error';

export const ItemNotFoundException = graphqlExceptionFactory(ItemNotFoundError);
