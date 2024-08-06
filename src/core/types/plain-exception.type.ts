import type { ExtraBase } from './extra-base.interface';
import type { ExtraSanitized } from './extra-sanitized.type';

export type PlainException<ErrorCode extends number | string, Extra extends ExtraSanitized<ExtraBase>> = {
  __typename: string;
  code: ErrorCode;
  message: string;
} & Extra;
