import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { ItemsService } from '../application';

import { ItemResult, ItemsResult } from './result';
import { ItemInput, ItemsInput } from './input';

@Injectable()
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => ItemResult, {
    name: 'item',
    nullable: false,
  })
  public async item(@Args('input') input: ItemInput): Promise<ItemResult> {
    const { itemId } = input;

    const item = await this.itemsService.findOneItemById(itemId);

    return { data: item };
  }

  @Query(() => ItemsResult, {
    name: 'items',
    nullable: false,
  })
  public async items(@Args('input') input: ItemsInput): Promise<ItemsResult> {
    const { itemIds } = input;

    const items = await this.itemsService.findItemsByIds(itemIds);

    return { data: items };
  }
}
