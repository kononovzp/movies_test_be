import type { User } from 'user/entities/user.entity';
import type { DeepNonNullable, PickByValue } from 'utility-types';

export const USER_ORDERABLE_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'createdDate',
] as const satisfies (keyof PickByValue<
  DeepNonNullable<User>,
  string | Date | boolean
>)[];
