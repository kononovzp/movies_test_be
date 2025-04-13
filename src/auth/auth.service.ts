import { Injectable } from '@nestjs/common';
import { AuthJwtTokenService } from 'auth/auth-jwt-token.service';
import { CreateUserDto } from 'auth/dto/create-user.dto';
import { LoginDto } from 'auth/dto/login.dto';
import { SuccessAuthResponseDto } from 'auth/dto/success-auth-response.dto';
import { TokenType } from 'auth/enums/token-type.enum';
import { IncorrectEmailOrPasswordException } from 'auth/exceptions/incorrect-email-or-password.exception';
import { IncorrectPasswordException } from 'auth/exceptions/incorrect-password.exception';
import { compare } from 'bcrypt';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private authJwtTokenService: AuthJwtTokenService,
  ) {}

  async signUp(
    data: CreateUserDto,
    remember: boolean,
  ): Promise<SuccessAuthResponseDto> {
    const user = await this.userService.createUser(data);
    const { id: userId } = user;
    const accessToken = await this.authJwtTokenService.generateToken({
      ...user,
      userId,
      tokenType: TokenType.ACCESS,
    });

    if (remember) {
      const refreshToken = await this.authJwtTokenService.generateToken({
        ...user,
        userId,
        tokenType: TokenType.REFRESH,
      });

      return { ...user, accessToken, refreshToken };
    }

    return { ...user, accessToken };
  }

  async signIn(
    data: LoginDto,
    remember: boolean,
  ): Promise<SuccessAuthResponseDto> {
    try {
      const { email, password } = data;
      const user = await this.userService.findUserByEmailOrFail(email);
      const { id: userId } = user;
      const isPasswordCorrect = await compare(password, user.password);
      console.log('isPasswordCorrect: ', isPasswordCorrect);

      if (!isPasswordCorrect) throw new IncorrectPasswordException();
      const accessToken = await this.authJwtTokenService.generateToken({
        ...user,
        userId,
        tokenType: TokenType.ACCESS,
      });

      if (remember) {
        const refreshToken = await this.authJwtTokenService.generateToken({
          ...user,
          userId,
          tokenType: TokenType.REFRESH,
        });

        return { ...user, accessToken, refreshToken };
      }

      return { ...user, accessToken };
    } catch (error) {
      throw new IncorrectEmailOrPasswordException({ cause: error });
    }
  }
}
