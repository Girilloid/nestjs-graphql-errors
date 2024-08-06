export type ExtraSanitized<Extra extends object> = Omit<Extra, 'code' | 'message'>;
