type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type Ensure<T, K extends keyof T> = T &
  Required<RequiredNotNull<Pick<T, K>>>;
