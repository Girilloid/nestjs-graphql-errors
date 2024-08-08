/* eslint-disable max-len */

import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { BaseGraphQLListException } from 'nestjs-graphql-errors';
import type { BaseGraphQLException } from 'nestjs-graphql-errors';

import { ItemNotFoundException, ItemProtectedException } from '../../core/exceptions';
import { ItemNotFoundErrorCode } from '../../presentation/error';
import type { ItemNotFoundError, ItemProtectedError } from '../../presentation/error';

import { ItemsService } from '../items.service';

describe('ItemsService', () => {
  let itemsService: ItemsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ItemsService],
    })
      .useMocker(createMock)
      .compile();

    itemsService = moduleRef.get<ItemsService>(ItemsService);
  });

  describe('findItemsByIds', () => {
    it('returns list of items when called with existing and not protected item ids', async () => {
      const itemIds = ['1'];

      const result = await itemsService.findItemsByIds(itemIds);

      expect(result).toBeInstanceOf(Array);

      const [item] = result;

      expect(item.id).toEqual(itemIds[0]);
      expect(item.protected).toEqual(false);
    });

    it('throws BaseGraphQLListException with ItemProtectedException when called with existing and protected item id', async () => {
      const itemIds = ['2'];

      let caughtException: BaseGraphQLListException;

      try {
        await itemsService.findItemsByIds(itemIds);
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
    });

    it('throws BaseGraphQLListException with ItemNotFoundException when called with not existing item id', async () => {
      const itemIds = ['3'];

      let caughtException: BaseGraphQLListException;

      try {
        await itemsService.findItemsByIds(itemIds);
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
    });

    it('throws BaseGraphQLListException with ItemProtectedException and ItemNotFoundException when called with matching item ids', async () => {
      const itemIds = ['2', '3'];

      let caughtException: BaseGraphQLListException;

      try {
        await itemsService.findItemsByIds(itemIds);
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

  describe('findOneItemById', () => {
    it('returns item when called with existing and not protected item id', async () => {
      const itemId = '1';

      const result = await itemsService.findOneItemById(itemId);

      expect(result.id).toEqual(itemId);
      expect(result.protected).toEqual(false);
    });

    it('throws ItemProtectedException when called with existing and protected item id', async () => {
      const itemId = '2';

      let caughtException: BaseGraphQLException<string, ItemProtectedError>;

      try {
        await itemsService.findOneItemById(itemId);
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(ItemProtectedException);
      expect(caughtException.code).toEqual('ITEM_PROTECTED');
      expect(caughtException.message).toEqual('Item protected');
      expect(caughtException.extra.itemId).toEqual(itemId);
    });

    it('throws ItemNotFoundException when called with not existing item id', async () => {
      const itemId = '3';

      let caughtException: BaseGraphQLException<typeof ItemNotFoundErrorCode, ItemNotFoundError>;

      try {
        await itemsService.findOneItemById(itemId);
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(ItemNotFoundException);
      expect(caughtException.code).toEqual(ItemNotFoundErrorCode.ITEM_NOT_FOUND);
      expect(caughtException.message).toEqual('Item not found');
      expect(caughtException.extra.itemId).toEqual(itemId);
    });
  });

  describe('itemWithMultipleExceptions', () => {
    it('throws BaseGraphQLListException with ItemNotFoundException', async () => {
      const itemId = '1';

      let caughtException: BaseGraphQLListException;

      try {
        await itemsService.itemWithMultipleExceptions(itemId);
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
    });
  });

  describe('itemsWithSingleException', () => {
    it('throws ItemNotFoundException', async () => {
      const itemIds = ['1'];

      let caughtException: BaseGraphQLException<typeof ItemNotFoundErrorCode, ItemNotFoundError>;

      try {
        await itemsService.itemsWithSingleException(itemIds);
      } catch (exception) {
        caughtException = exception;
      }

      expect(caughtException).toBeInstanceOf(ItemNotFoundException);
      expect(caughtException.code).toEqual(ItemNotFoundErrorCode.ITEM_NOT_FOUND);
      expect(caughtException.message).toEqual('Item not found');
      expect(caughtException.extra.itemId).toEqual(itemIds[0]);
    });
  });
});
