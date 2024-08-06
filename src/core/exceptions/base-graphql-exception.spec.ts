import type { ExtraBase } from '../types';

import { BaseGraphQLException } from './base-graphql.exception';

describe('BaseGraphQLException', () => {
  describe('toPlain', () => {
    type Extra = { value: string } & ExtraBase;

    it('returns plain representation with message', () => {
      const exception = new BaseGraphQLException<string, Extra>('__typename', 'code', 'message', {
        value: 'value',
      });

      const result = exception.toPlain();

      expect(result).toEqual({
        __typename: '__typename',
        code: 'code',
        message: 'message',
        value: 'value',
      });
    });

    it('returns plain representation without message', () => {
      const exception = new BaseGraphQLException<string, Extra>('__typename', 'code', undefined, {
        value: 'value',
      });

      const result = exception.toPlain();

      expect(result).toEqual({
        __typename: '__typename',
        code: 'code',
        message: '',
        value: 'value',
      });
    });
  });
});
