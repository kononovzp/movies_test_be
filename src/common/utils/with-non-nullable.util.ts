export type WithNonNullable<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

export function withNonNullable<T, K extends keyof T>(key?: K) {
  return (value: T): value is WithNonNullable<NonNullable<T>, K> =>
    key != null ? value[key] != null : value != null;
}
