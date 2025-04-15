import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Env } from 'environment/environment.type';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'user/entities/user.entity';
import { UserAlreadyExistsException } from 'user/exceptions/user-already-exists.exception';
import { UserNotFoundByEmailException } from 'user/exceptions/user-not-found-by-email.exception';
import { UserNotFoundByIdException } from 'user/exceptions/user-not-found-by-id.exception';
import { UserCreateData } from 'user/types/user-create-data.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  private PASSWORD_SALT_ROUNDS = this.configService.get(
    'PASSWORD_SALT_ROUNDS',
    { infer: true },
  );

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, this.PASSWORD_SALT_ROUNDS);

    return hashedPassword;
  }

  async createUser(data: UserCreateData): Promise<User> {
    const doesUserExist = await this.userRepository.exists({
      where: { email: data.email.toLowerCase() },
    });

    if (doesUserExist) throw new UserAlreadyExistsException(data.email);

    const user = new User(data);
    const hashedPassword = await this.hashPassword(data.password);

    const { id: userId } = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return await this.findUserByIdOrFail(userId);
  }

  async findUser(
    findOptions: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ): Promise<User | null> {
    if (typeof findOptions.email === 'string')
      findOptions.email = findOptions.email?.toLowerCase();

    return this.userRepository.findOne({
      where: findOptions,
      relations,
    });
  }

  async findUserById(
    id: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User | null> {
    return this.findUser({ id }, relations);
  }

  async findUserByIdOrFail(
    id: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    const user = await this.findUser({ id }, relations);

    if (!user) throw new UserNotFoundByIdException(id);

    return user;
  }

  async findUserByEmail(
    email: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User | null> {
    return this.findUser({ email }, relations);
  }

  async findUserByEmailOrFail<T = User>(
    email: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<T> {
    const user = await this.findUserByEmail(email, relations);

    if (!user) throw new UserNotFoundByEmailException(email);

    return user as T;
  }
}
