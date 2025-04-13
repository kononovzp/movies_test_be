import { BasicEntity } from 'common/entities/basic.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'user/entities/user.entity';

@Entity()
export class Movies extends BasicEntity {
  constructor(data: Movies) {
    super();
    Object.assign(this, data);
  }

  @Column()
  title: string;

  @Column()
  publishYear: string;

  @Column()
  filePath: string;

  @ManyToOne(() => User, (user) => user.movies, { nullable: false })
  @JoinColumn()
  user: User;
}
