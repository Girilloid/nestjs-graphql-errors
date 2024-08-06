import { Injectable } from '@nestjs/common';
import { BaseGraphQLListException } from 'nestjs-graphql-errors';

import { ItemNotFoundException, ItemProtectedException } from '../core/exceptions';
import { ItemNotFoundErrorCode } from '../presentation/error';

interface Item {
  readonly id: string;
  readonly protected: boolean;
}

@Injectable()
export class ItemsService {
  private readonly items: readonly Item[] = [
    {
      id: '1',
      protected: false,
    },
    {
      id: '2',
      protected: true,
    },
  ];

  public findItemsByIds(itemIds: readonly string[]): Promise<Item[]> {
    const items = this.items.filter((item) => {
      return itemIds.includes(item.id);
    });

    const errors = [];

    itemIds.forEach((itemId) => {
      const item = items.find((item) => {
        return item.id === itemId;
      });

      if (!item) {
        return void errors.push(
          new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId }),
        );
      }

      if (item.protected) {
        return void errors.push(new ItemProtectedException('ITEM_PROTECTED', 'Item protected', { itemId }));
      }
    });

    if (errors.length > 0) {
      throw new BaseGraphQLListException(...errors);
    }

    return Promise.resolve(items);
  }

  public findOneItemById(itemId: string): Promise<Item> {
    const item = this.items.find((item) => {
      return item.id === itemId;
    });

    if (!item) {
      throw new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId });
    }

    if (item.protected) {
      throw new ItemProtectedException('ITEM_PROTECTED', 'Item protected', { itemId });
    }

    return Promise.resolve(item);
  }
}
