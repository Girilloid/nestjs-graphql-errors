import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { app } from '../../setup';

describe('Items GraphQL', () => {
  describe('item query', () => {
    const itemQuery = `
      query ($input: ItemInput!) {
        item(input: $input) {
          data {
            id
            protected
          }
          error {
            ... on ItemNotFoundError {
              itemNotFoundErrorCode: code
              itemId
              message
            }
            ... on ItemProtectedError {
              itemProtectedErrorCode: code
              itemId
              message
            }
          }
        }
      }
    `;

    it('responds with Item when requested with existing and not protected item id', () => {
      const itemId = '1';

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemQuery,
          variables: {
            input: {
              itemId,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.item;

          expect(payload.data).not.toBeNull();
          expect(payload.error).toBeNull();

          expect(payload.data.id).toEqual(itemId);
          expect(payload.data.protected).toEqual(false);
        });
    });

    it('responds with ItemProtectedError when requested with existing and protected item id', () => {
      const itemId = '2';

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemQuery,
          variables: {
            input: {
              itemId,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.item;

          expect(payload.data).toBeNull();
          expect(payload.error).not.toBeNull();

          expect(payload.error.itemNotFoundErrorCode).toBeUndefined();
          expect(payload.error.itemProtectedErrorCode).toEqual('ITEM_PROTECTED');
          expect(payload.error.message).toEqual('Item protected');
          expect(payload.error.itemId).toEqual(itemId);
        });
    });

    it('responds with ItemNotFoundError when requested with not existing item id', () => {
      const itemId = '3';

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemQuery,
          variables: {
            input: {
              itemId,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.item;

          expect(payload.data).toBeNull();
          expect(payload.error).not.toBeNull();

          expect(payload.error.itemProtectedErrorCode).toBeUndefined();
          expect(payload.error.itemNotFoundErrorCode).toEqual('ITEM_NOT_FOUND');
          expect(payload.error.message).toEqual('Item not found');
          expect(payload.error.itemId).toEqual(itemId);
        });
    });
  });

  describe('itemWithMultipleErrors query', () => {
    const itemWithMultipleErrorsQuery = `
      query ($input: ItemInput!) {
        itemWithMultipleErrors(input: $input) {
          data {
            id
            protected
          }
          error {
            ... on ItemNotFoundError {
              itemNotFoundErrorCode: code
              itemId
              message
            }
            ... on ItemProtectedError {
              itemProtectedErrorCode: code
              itemId
              message
            }
          }
        }
      }
    `;

    it('responds with ItemNotFoundError', () => {
      const itemId = '1';

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemWithMultipleErrorsQuery,
          variables: {
            input: {
              itemId,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.itemWithMultipleErrors;

          expect(payload.data).toBeNull();
          expect(payload.error).not.toBeNull();

          expect(payload.error.itemProtectedErrorCode).toBeUndefined();
          expect(payload.error.itemNotFoundErrorCode).toEqual('ITEM_NOT_FOUND');
          expect(payload.error.message).toEqual('Item not found');
          expect(payload.error.itemId).toEqual(itemId);
        });
    });
  });

  describe('items query', () => {
    const itemsQuery = `
      query ($input: ItemsInput!) {
        items(input: $input) {
          data {
            id
            protected
          }
          error {
            ... on ItemNotFoundError {
              itemNotFoundErrorCode: code
              itemId
              message
            }
            ... on ItemProtectedError {
              itemProtectedErrorCode: code
              itemId
              message
            }
          }
        }
      }
    `;

    it('responds with list of items when requested with existing and not protected item id', () => {
      const itemIds = ['1'];

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemsQuery,
          variables: {
            input: {
              itemIds,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.items;

          expect(payload.data).not.toBeNull();
          expect(payload.error).toBeNull();

          expect(payload.data).toBeInstanceOf(Array);
          expect(payload.data.length).toEqual(1);

          const [item] = payload.data;

          expect(item.id).toEqual(itemIds[0]);
          expect(item.protected).toEqual(false);
        });
    });

    it('responds with ItemProtectedError when requested with existing and protected item id', () => {
      const itemIds = ['2'];

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemsQuery,
          variables: {
            input: {
              itemIds,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.items;

          expect(payload.data).toBeNull();
          expect(payload.error).not.toBeNull();

          expect(payload.error).toBeInstanceOf(Array);
          expect(payload.error.length).toEqual(1);

          const [error] = payload.error;

          expect(error.itemNotFoundErrorCode).toBeUndefined();
          expect(error.itemProtectedErrorCode).toEqual('ITEM_PROTECTED');
          expect(error.message).toEqual('Item protected');
          expect(error.itemId).toEqual(itemIds[0]);
        });
    });

    it('responds with ItemNotFoundError when requested with not existing item id', () => {
      const itemIds = ['3'];

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemsQuery,
          variables: {
            input: {
              itemIds,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.items;

          expect(payload.data).toBeNull();
          expect(payload.error).not.toBeNull();

          expect(payload.error).toBeInstanceOf(Array);
          expect(payload.error.length).toEqual(1);

          const [error] = payload.error;

          expect(error.itemProtectedErrorCode).toBeUndefined();
          expect(error.itemNotFoundErrorCode).toEqual('ITEM_NOT_FOUND');
          expect(error.message).toEqual('Item not found');
          expect(error.itemId).toEqual(itemIds[0]);
        });
    });

    it('responds with ItemProtected and ItemNotFoundError when requested with matching ids', () => {
      const itemIds = ['2', '3'];

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemsQuery,
          variables: {
            input: {
              itemIds,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.items;

          expect(payload.data).toBeNull();
          expect(payload.error).not.toBeNull();

          expect(payload.error).toBeInstanceOf(Array);
          expect(payload.error.length).toEqual(2);

          const [itemProtectedError, itemNotFoundError] = payload.error;

          expect(itemProtectedError.itemNotFoundErrorCode).toBeUndefined();
          expect(itemProtectedError.itemProtectedErrorCode).toEqual('ITEM_PROTECTED');
          expect(itemProtectedError.message).toEqual('Item protected');
          expect(itemProtectedError.itemId).toEqual(itemIds[0]);

          expect(itemNotFoundError.itemProtectedErrorCode).toBeUndefined();
          expect(itemNotFoundError.itemNotFoundErrorCode).toEqual('ITEM_NOT_FOUND');
          expect(itemNotFoundError.message).toEqual('Item not found');
          expect(itemNotFoundError.itemId).toEqual(itemIds[1]);
        });
    });
  });

  describe('itemsWithSingleError query', () => {
    const itemsWithSingleErrorQuery = `
      query ($input: ItemsInput!) {
        itemsWithSingleError(input: $input) {
          data {
            id
            protected
          }
          error {
            ... on ItemNotFoundError {
              itemNotFoundErrorCode: code
              itemId
              message
            }
            ... on ItemProtectedError {
              itemProtectedErrorCode: code
              itemId
              message
            }
          }
        }
      }
    `;

    it('responds with ItemNotFoundError', () => {
      const itemIds = ['1'];

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: itemsWithSingleErrorQuery,
          variables: {
            input: {
              itemIds,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          const payload = response.body.data.itemsWithSingleError;

          expect(payload.data).toBeNull();
          expect(payload.error).not.toBeNull();

          expect(payload.error).toBeInstanceOf(Array);
          expect(payload.error.length).toEqual(1);

          const [error] = payload.error;

          expect(error.itemProtectedErrorCode).toBeUndefined();
          expect(error.itemNotFoundErrorCode).toEqual('ITEM_NOT_FOUND');
          expect(error.message).toEqual('Item not found');
          expect(error.itemId).toEqual(itemIds[0]);
        });
    });
  });
});
