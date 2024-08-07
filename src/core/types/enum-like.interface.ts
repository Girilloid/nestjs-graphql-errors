export interface EnumLike {
  [numberKey: number]: string;
  [stringKey: string]: number | string;
}

export type EnumLikeValue<T> = T extends EnumLike ? T[keyof T] : T;
