export type EnsureAllEnumKeys<
  T extends string | number | symbol,
  U extends Record<T, unknown>,
> = U;
