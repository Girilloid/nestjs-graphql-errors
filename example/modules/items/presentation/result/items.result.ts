import { ObjectType } from '@nestjs/graphql';
import { GraphQLResult } from 'nestjs-graphql-errors';

import { ItemDto } from '../dto';
import { ItemsError } from '../error';

@ObjectType('ItemsResult')
export class ItemsResult extends GraphQLResult([ItemDto], [ItemsError]) {}
