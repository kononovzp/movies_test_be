import type { User } from 'user/entities/user.entity';
import type { DeepNonNullable, PickByValue } from 'utility-types';

export const USER_SEARCHABLE_FIELDS = [
  'firstName',
  'lastName',
  'email',
] as const satisfies (keyof PickByValue<DeepNonNullable<User>, string>)[];
