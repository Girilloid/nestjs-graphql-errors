import { Args, Query, Resolver } from '@nestjs/graphql';

import { ItemsService } from '../application';

import { ItemResult, ItemsResult } from './result';
import { ItemInput, ItemsInput } from './input';

@Resolver()
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(/* istanbul ignore next */ () => ItemResult, {
    name: 'item',
    nullable: false,
  })
  public async item(@Args('input') input: ItemInput): Promise<ItemResult> {
    const { itemId } = input;

    const item = await this.itemsService.findOneItemById(itemId);

    return { data: item };
  }

  @Query(/* istanbul ignore next */ () => ItemResult, {
    name: 'itemWithMultipleErrors',
    nullable: false,
  })
  public async itemWithMultipleErrors(@Args('input') input: ItemInput): Promise<ItemResult> {
    const { itemId } = input;

    await this.itemsService.itemWithMultipleExceptions(itemId);

    /* istanbul ignore next */
    return {};
  }

  @Query(/* istanbul ignore next */ () => ItemsResult, {
    name: 'items',
    nullable: false,
  })
  public async items(@Args('input') input: ItemsInput): Promise<ItemsResult> {
    const { itemIds } = input;

    const items = await this.itemsService.findItemsByIds(itemIds);

    return { data: items };
  }

  @Query(/* istanbul ignore next */ () => ItemsResult, {
    name: 'itemsWithSingleError',
    nullable: false,
  })
  public async itemsWithSingleError(@Args('input') input: ItemsInput): Promise<ItemsResult> {
    const { itemIds } = input;

    await this.itemsService.itemsWithSingleException(itemIds);

    /* istanbul ignore next */
    return {};
  }
}
