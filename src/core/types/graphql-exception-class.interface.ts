import type { ExtraBase } from './extra-base.interface';
import type { ExtraSanitized } from './extra-sanitized.type';
import type { NotEmptyOrVoid } from './not-empty-or-void.type';

export interface GraphQLExceptionClass<ExtraInstance, ErrorCode extends number | string, Extra extends ExtraBase>
  extends Function {
  new (code: ErrorCode, message: string, extra: NotEmptyOrVoid<ExtraSanitized<Extra>>): ExtraInstance;
}
