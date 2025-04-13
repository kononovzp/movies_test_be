import type { BasicEntity } from 'common/entities/basic.entity';
import type { Except } from 'type-fest';
import type { User } from 'user/entities/user.entity';

export type UserCreateData = Except<User, keyof BasicEntity>;
