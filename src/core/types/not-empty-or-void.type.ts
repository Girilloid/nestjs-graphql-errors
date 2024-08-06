export type NotEmptyOrVoid<T> = T extends Record<string, never> ? void : T;
