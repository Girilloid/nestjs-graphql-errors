import { ObjectType } from '@nestjs/graphql';
import { GraphQLResult } from 'nestjs-graphql-errors';

import { ItemDto } from '../dto';
import { ItemError } from '../error';

@ObjectType('ItemResult')
export class ItemResult extends GraphQLResult(ItemDto, ItemError) {}
