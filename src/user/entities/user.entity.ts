import { BasicEntity } from 'common/entities/basic.entity';
import { Movies } from 'movies/entity/movies.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { UserCreateData } from 'user/types/user-create-data.type';

@Entity()
export class User extends BasicEntity {
  constructor(data: UserCreateData) {
    super();
    Object.assign(this, data);
  }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
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
