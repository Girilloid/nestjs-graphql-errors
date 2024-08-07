import type { EnumLike } from './enum-like.interface';

export interface ExtraBase {
  readonly code: EnumLike | string;
  readonly message?: string;
}
