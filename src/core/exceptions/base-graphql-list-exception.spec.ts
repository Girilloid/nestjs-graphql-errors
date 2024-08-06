import type { ExtraBase } from '../types';

import { BaseGraphQLException } from './base-graphql.exception';
import { BaseGraphQLListException } from './base-graphql-list.exception';

describe('BaseGraphQLListException', () => {
  describe('toPlain', () => {
    type Extra = { value: string } & ExtraBase;

    it('returns plain representation', () => {
      const exception = new BaseGraphQLListException(
        new BaseGraphQLException<string, Extra>('__typename', 'code', 'message', {
          value: 'value',
        }),
      );

      const result = exception.toPlain();

      expect(result).toEqual([
        {
          __typename: '__typename',
          code: 'code',
          message: 'message',
          value: 'value',
        },
      ]);
    });
  });
});
