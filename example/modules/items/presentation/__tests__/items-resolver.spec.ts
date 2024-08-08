/* eslint-disable max-len */

import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { resetAllWhenMocks, when } from 'jest-when';
import { BaseGraphQLListException } from 'nestjs-graphql-errors';
import type { BaseGraphQLException } from 'nestjs-graphql-errors';

import { ItemsService } from '../../application/items.service';
import { ItemNotFoundException, ItemProtectedException } from '../../core/exceptions';

import { ItemNotFoundErrorCode } from '../error';
import type { ItemNotFoundError, ItemProtectedError } from '../error';
import { ItemsResolver } from '../items.resolver';

describe('ItemsResolver', () => {
  let itemsResolver: ItemsResolver;
  let itemsService: ItemsService;

  beforeEach(async () => {
    resetAllWhenMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [ItemsResolver],
    })
      .useMocker(createMock)
      .compile();

    itemsResolver = moduleRef.get<ItemsResolver>(ItemsResolver);
    itemsService = moduleRef.get<ItemsService>(ItemsService);
  });

  describe('item', () => {
    it('returns Item when called with existing and not protected item id', async () => {
      const itemId = '1';

      when(itemsService.findOneItemById).calledWith(itemId).mockResolvedValue({
        id: itemId,
        protected: false,
      });

      const result = await itemsResolver.item({ itemId });

      expect(result.data).not.toBeUndefined();
      expect(result.error).toBeUndefined();

      expect(result.data.id).toEqual(itemId);
      expect(result.data.protected).toEqual(false);

      expect(itemsService.findOneItemById).toHaveBeenCalledTimes(1);
      expect(itemsService.findOneItemById).toHaveBeenCalledWith(itemId);
    });

    it('throws ItemProtectedException when called with existing and protected item id', async () => {
      const itemId = '2';

      when(itemsService.findOneItemById)
        .calledWith(itemId)
        .mockRejectedValue(new ItemProtectedException('ITEM_PROTECTED', 'Item protected', { itemId }));

      let caughtException: BaseGraphQLException<string, ItemProtectedError>;

      try {
        await itemsResolver.item({ itemId });
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(ItemProtectedException);

      expect(caughtException.code).toEqual('ITEM_PROTECTED');
      expect(caughtException.message).toEqual('Item protected');
      expect(caughtException.extra.itemId).toEqual(itemId);

      expect(itemsService.findOneItemById).toHaveBeenCalledTimes(1);
      expect(itemsService.findOneItemById).toHaveBeenCalledWith(itemId);
    });

    it('throws ItemNotFoundException when called with not existing item id', async () => {
      const itemId = '3';

      when(itemsService.findOneItemById)
        .calledWith(itemId)
        .mockRejectedValue(
          new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId }),
        );

      let caughtException: BaseGraphQLException<typeof ItemNotFoundErrorCode, ItemNotFoundError>;

      try {
        await itemsResolver.item({ itemId });
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(ItemNotFoundException);

      expect(caughtException.code).toEqual(ItemNotFoundErrorCode.ITEM_NOT_FOUND);
      expect(caughtException.message).toEqual('Item not found');
      expect(caughtException.extra.itemId).toEqual(itemId);

      expect(itemsService.findOneItemById).toHaveBeenCalledTimes(1);
      expect(itemsService.findOneItemById).toHaveBeenCalledWith(itemId);
    });
  });

  describe('itemWithMultipleErrors', () => {
    it('throws BaseGraphQLListException with ItemNotFoundException', async () => {
      const itemId = '1';

      when(itemsService.itemWithMultipleExceptions)
        .calledWith(itemId)
        .mockRejectedValue(
          new BaseGraphQLListException(
            new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId }),
            new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId }),
          ),
        );

      let caughtException: BaseGraphQLListException;

      try {
        await itemsResolver.itemWithMultipleErrors({ itemId });
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(BaseGraphQLListException);
      expect(caughtException.errors).toBeInstanceOf(Array);
      expect(caughtException.errors.length).toEqual(2);

      const exception = caughtException.errors[0] as BaseGraphQLException<string, ItemNotFoundError>;

      expect(exception).toBeInstanceOf(ItemNotFoundException);

      expect(exception.code).toEqual(ItemNotFoundErrorCode.ITEM_NOT_FOUND);
      expect(exception.message).toEqual('Item not found');
      expect(exception.extra.itemId).toEqual(itemId);

      expect(itemsService.itemWithMultipleExceptions).toHaveBeenCalledTimes(1);
      expect(itemsService.itemWithMultipleExceptions).toHaveBeenCalledWith(itemId);
    });
  });

  describe('items', () => {
    it('returns list of items when called with existing and not protected item id', async () => {
      const itemIds = ['1'];

      when(itemsService.findItemsByIds)
        .calledWith(itemIds)
        .mockResolvedValue([
          {
            id: itemIds[0],
            protected: false,
          },
        ]);

      const result = await itemsResolver.items({ itemIds });

      expect(result.data).not.toBeUndefined();
      expect(result.error).toBeUndefined();

      expect(result.data).toBeInstanceOf(Array);

      const [item] = result.data;

      expect(item.id).toEqual(itemIds[0]);
      expect(item.protected).toEqual(false);

      expect(itemsService.findItemsByIds).toHaveBeenCalledTimes(1);
      expect(itemsService.findItemsByIds).toHaveBeenCalledWith(itemIds);
    });

    it('throws BaseGraphQLListException with ItemProtectedException when called with existing and protected item id', async () => {
      const itemIds = ['2'];

      when(itemsService.findItemsByIds)
        .calledWith(itemIds)
        .mockRejectedValue(
          new BaseGraphQLListException(
            new ItemProtectedException('ITEM_PROTECTED', 'Item protected', { itemId: itemIds[0] }),
          ),
        );

      let caughtException: BaseGraphQLListException;

      try {
        await itemsResolver.items({ itemIds });
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(BaseGraphQLListException);
      expect(caughtException.errors).toBeInstanceOf(Array);
      expect(caughtException.errors.length).toEqual(1);

      const exception = caughtException.errors[0] as BaseGraphQLException<string, ItemProtectedError>;

      expect(exception).toBeInstanceOf(ItemProtectedException);

      expect(exception.code).toEqual('ITEM_PROTECTED');
      expect(exception.message).toEqual('Item protected');
      expect(exception.extra.itemId).toEqual(itemIds[0]);

      expect(itemsService.findItemsByIds).toHaveBeenCalledTimes(1);
      expect(itemsService.findItemsByIds).toHaveBeenCalledWith(itemIds);
    });

    it('throws BaseGraphQLListException with ItemNotFoundException when called with not existing item id', async () => {
      const itemIds = ['3'];

      when(itemsService.findItemsByIds)
        .calledWith(itemIds)
        .mockRejectedValue(
          new BaseGraphQLListException(
            new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId: itemIds[0] }),
          ),
        );

      let caughtException: BaseGraphQLListException;

      try {
        await itemsResolver.items({ itemIds });
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(BaseGraphQLListException);
      expect(caughtException.errors).toBeInstanceOf(Array);
      expect(caughtException.errors.length).toEqual(1);

      const exception = caughtException.errors[0] as BaseGraphQLException<string, ItemNotFoundError>;

      expect(exception).toBeInstanceOf(ItemNotFoundException);

      expect(exception.code).toEqual(ItemNotFoundErrorCode.ITEM_NOT_FOUND);
      expect(exception.message).toEqual('Item not found');
      expect(exception.extra.itemId).toEqual(itemIds[0]);

      expect(itemsService.findItemsByIds).toHaveBeenCalledTimes(1);
      expect(itemsService.findItemsByIds).toHaveBeenCalledWith(itemIds);
    });

    it('throws BaseGraphQLListException with ItemProtectedException and ItemNotFoundException when called with matching item ids', async () => {
      const itemIds = ['2', '3'];

      when(itemsService.findItemsByIds)
        .calledWith(itemIds)
        .mockRejectedValue(
          new BaseGraphQLListException(
            new ItemProtectedException('ITEM_PROTECTED', 'Item protected', { itemId: itemIds[0] }),
            new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId: itemIds[1] }),
          ),
        );

      let caughtException: BaseGraphQLListException;

      try {
        await itemsResolver.items({ itemIds });
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(BaseGraphQLListException);
      expect(caughtException.errors).toBeInstanceOf(Array);
      expect(caughtException.errors.length).toEqual(2);

      const itemProtectedException = caughtException.errors[0] as BaseGraphQLException<string, ItemProtectedError>;
      const itemNotFoundException = caughtException.errors[1] as BaseGraphQLException<string, ItemNotFoundError>;

      expect(itemProtectedException).toBeInstanceOf(ItemProtectedException);

      expect(itemProtectedException.code).toEqual('ITEM_PROTECTED');
      expect(itemProtectedException.message).toEqual('Item protected');
      expect(itemProtectedException.extra.itemId).toEqual(itemIds[0]);

      expect(itemNotFoundException).toBeInstanceOf(ItemNotFoundException);

      expect(itemNotFoundException.code).toEqual(ItemNotFoundErrorCode.ITEM_NOT_FOUND);
      expect(itemNotFoundException.message).toEqual('Item not found');
      expect(itemNotFoundException.extra.itemId).toEqual(itemIds[1]);
    });
  });

  describe('itemsWithSingleException', () => {
    it('throws ItemNotFoundException', async () => {
      const itemIds = ['1'];

      when(itemsService.itemsWithSingleException)
        .calledWith(itemIds)
        .mockRejectedValue(
          new ItemNotFoundException(ItemNotFoundErrorCode.ITEM_NOT_FOUND, 'Item not found', { itemId: itemIds[0] }),
        );

      let caughtException: BaseGraphQLException<typeof ItemNotFoundErrorCode, ItemNotFoundError>;

      try {
        await itemsResolver.itemsWithSingleError({ itemIds });
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(ItemNotFoundException);

      expect(caughtException.code).toEqual(ItemNotFoundErrorCode.ITEM_NOT_FOUND);
      expect(caughtException.message).toEqual('Item not found');
      expect(caughtException.extra.itemId).toEqual(itemIds[0]);

      expect(itemsService.itemsWithSingleException).toHaveBeenCalledTimes(1);
      expect(itemsService.itemsWithSingleException).toHaveBeenCalledWith(itemIds);
    });
  });
});
