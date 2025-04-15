import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { UserJwtPayloadDto } from 'auth/dto/user-jwt-payload.dto';
import { TokenType } from 'auth/enums/token-type.enum';
import { InvalidJwtException } from 'auth/exceptions/invalid-jwt.exception';
import { JwtExpiredException } from 'auth/exceptions/jwt-expired.exception';
import { Env } from 'environment/environment.type';

@Injectable()
export class AuthJwtTokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  async generateToken(
    payload: ConstructorParameters<typeof UserJwtPayloadDto>[0],
  ): Promise<string> {
    const payloadInstance = new UserJwtPayloadDto(payload);

    await validateOrReject(payloadInstance);

    const { tokenType } = payloadInstance;

    const expiresInEnvName = {
      [TokenType.ACCESS]: 'JWT_ACCESS_TOKEN_EXPIRES_IN' as const,
      [TokenType.REFRESH]: 'JWT_REFRESH_TOKEN_EXPIRES_IN' as const,
    }[tokenType];

    const expiresIn = this.configService.get(expiresInEnvName, { infer: true });

    const currentTime = Math.floor(Date.now() / 1000);
    const payloadWithClaims = {
      ...instanceToPlain(payloadInstance, { excludeExtraneousValues: true }),
      iat: currentTime,
      exp: currentTime + expiresIn,
    };

    const token = this.jwtService.sign(payloadWithClaims);

    return token;
  }

  verifyToken(jwtToken: string): UserJwtPayloadDto {
    try {
      const payload = this.jwtService.verify<UserJwtPayloadDto>(jwtToken);

      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new JwtExpiredException({ cause: error });
      else if (error instanceof JsonWebTokenError)
        throw new InvalidJwtException({ cause: error });
      else throw error;
    }
  }
}
