import type { ExtraBase, ExtraSanitized, NotEmptyOrVoid, PlainException } from '../types';

/**
 * Base class for all the GraphQLException subclasses.
 *
 * @example
 * ```ts
 * new BaseGraphQLException('CODE', 'Message', { key: 'value' });
 * ```
 *
 * @template ErrorCode
 * @template Extra
 *
 * @class
 * @implements {Error}
 * @public
 */
export class BaseGraphQLException<ErrorCode extends number | string, Extra extends ExtraBase> extends Error {
  /**
   * GraphQL __typename.
   *
   * @type {string}
   *
   * @public
   */
  public readonly __typename: string;

  /**
   * Exception code.
   *
   * @type {ErrorCode}
   *
   * @public
   */
  public readonly code: ErrorCode;

  /**
   * Exception extra fields.
   *
   * @type {NotEmptyOrVoid<ExtraSanitized<Extra>>}
   *
   * @public
   */
  public readonly extra: NotEmptyOrVoid<ExtraSanitized<Extra>>;

  /**
   * Exception message.
   *
   * @type {?string}
   *
   * @public
   */
  public readonly message: string;

  /**
   * Create an instance of BaseGraphQLException.
   *
   * @example
   * ```ts
   * new BaseGraphQLException('CODE', 'Message', { key: 'value' });
   * ```
   *
   * @param {string} __typename GraphQL __typename.
   * @param {ErrorCode} code Exception code.
   * @param {?string} message Exception message.
   * @param {NotEmptyOrVoid<ExtraSanitized<Extra>>} extra Exception extra fields
   *
   * @constructor
   * @public
   */
  constructor(__typename: string, code: ErrorCode, message: string, extra: NotEmptyOrVoid<ExtraSanitized<Extra>>) {
    super();

    this.__typename = __typename;

    this.code = code;
    this.message = message || '';
    this.extra = extra;
  }

  /**
   * Method to retrieve plain representation of GraphQLException.
   *
   * @example
   * ```ts
   * const plainSomeGraphQLException = new BaseGraphQLException('CODE', 'Message', { key: 'value' }).toPlain();
   * ```
   *
   * @returns Plain representation of GraphQLExceptions.
   *
   * @public
   */
  public toPlain(): PlainException<ErrorCode, Extra> {
    return {
      __typename: this.__typename,
      code: this.code,
      message: this.message,
      ...(this.extra as unknown as Extra),
    };
  }
}
