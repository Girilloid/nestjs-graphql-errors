import type { EnumLike, EnumLikeValue } from './enum-like.interface';
import type { ExtraBase } from './extra-base.interface';
import type { ExtraSanitized } from './extra-sanitized.type';

export type PlainException<ErrorCode extends EnumLike | string, Extra extends ExtraSanitized<ExtraBase>> = {
  __typename: string;
  code: EnumLikeValue<ErrorCode>;
  message: string;
} & Extra;
