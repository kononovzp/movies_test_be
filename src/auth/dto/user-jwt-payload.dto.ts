import { TokenType } from 'auth/enums/token-type.enum';
import { Expose } from 'class-transformer';
import { IsEnum, IsUUID } from 'class-validator';

export class UserJwtPayloadDto {
  constructor(data: Omit<UserJwtPayloadDto, 'iat' | 'exp'>) {
    Object.assign(this, data);
  }

  @Expose()
  @IsUUID()
  userId: string;

  @Expose()
  @IsEnum(TokenType)
  tokenType: TokenType;

  @Expose()
  iat?: number;

  @Expose()
  exp?: number;
}
