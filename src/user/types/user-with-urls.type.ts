import type { User } from 'user/entities/user.entity';
import type { OmitByValue } from 'utility-types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type UserWithUrls = OmitByValue<User, Function> & {
  avatarUrl: string | undefined;
};
