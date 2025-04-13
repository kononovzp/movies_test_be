import { BasicEntity } from 'common/entities/basic.entity';
import { Movies } from 'movies/entity/movies.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import { UserCreateData } from 'user/types/user-create-data.type';

@Entity()
export class User extends BasicEntity {
  constructor(data: UserCreateData) {
    super();
    Object.assign(this, data);
  }

  @Column()
  @Index('idx_user_first_name_trgm', { synchronize: false })
  firstName: string;

  @Column()
  @Index('idx_user_last_name_trgm', { synchronize: false })
  lastName: string;

  @Column({ unique: true })
  @Index('idx_user_email_trgm', { synchronize: false })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  //@ts-expect-error: used implicitly by TypeORM
  private emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  @Column()
  password: string;

  @OneToMany(() => Movies, (movies) => movies.user, { nullable: true })
  movies?: Movies[];
}
