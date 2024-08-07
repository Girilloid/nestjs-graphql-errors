import type { EnumLike, EnumLikeValue, ExtraBase, ExtraSanitized, NotEmptyOrVoid, PlainException } from '../types';

/**
 * Base class for all GraphQLException subclasses.
 *
 * @example
 * ```ts
 * new BaseGraphQLException('CODE', 'Message', { key: 'value' });
 * ```
 *
 * @class
 * @public
 */
export class BaseGraphQLException<ErrorCode extends EnumLike | string, Extra extends ExtraBase> extends Error {
  /**
   * GraphQL __typename.
   *
   * @public
   */
  public readonly __typename: string;

  /**
   * Exception code.
   *
   * @public
   */
  public readonly code: EnumLikeValue<ErrorCode>;

  /**
   * Exception extra fields.
   *
   * @public
   */
  public readonly extra: NotEmptyOrVoid<ExtraSanitized<Extra>>;

  /**
   * Exception message.
   *
   * @public
   */
  public readonly message: string;

  /**
   * Creates an instance of BaseGraphQLException.
   *
   * @example
   * ```ts
   * new BaseGraphQLException('CODE', 'Message', { key: 'value' });
   * ```
   *
   * @param __typename GraphQL __typename.
   * @param code Exception code.
   * @param message Exception message.
   * @param extra Exception extra fields
   *
   * @constructor
   * @public
   */
  constructor(
    __typename: string,
    code: EnumLikeValue<ErrorCode>,
    message: string,
    extra: NotEmptyOrVoid<ExtraSanitized<Extra>>,
  ) {
    super();

    this.__typename = __typename;

    this.code = code;
    this.message = message || '';
    this.extra = extra;
  }

  /**
   * Method for getting a simple representation of GraphQLExceptions.
   *
   * @example
   * ```ts
   * const plainSomeGraphQLException = new BaseGraphQLException('CODE', 'Message', { key: 'value' }).toPlain();
   * ```
   *
   * @returns Simple representation of GraphQLException.
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
