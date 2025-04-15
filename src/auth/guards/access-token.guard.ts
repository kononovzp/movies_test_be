import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthJwtTokenService } from 'auth/auth-jwt-token.service';
import { REQUEST_USER_PAYLOAD_FIELD } from 'auth/constants/request-user-payload-field.const';
import { PUBLIC_KEY } from 'auth/decorators/public.decorator';
import { TokenType } from 'auth/enums/token-type.enum';
import { InvalidJwtTypeException } from 'auth/exceptions/invalid-jwt-type.exception';
import { tokenFromHeader } from 'auth/utils/token-from-header';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authJwtTokenService: AuthJwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = tokenFromHeader(request);

    if (!accessToken) throw new UnauthorizedException();

    const payload = this.authJwtTokenService.verifyToken(accessToken);

    const { tokenType } = payload;

    if (tokenType !== TokenType.ACCESS) throw new InvalidJwtTypeException();

    request[REQUEST_USER_PAYLOAD_FIELD] = {
      userId: payload.userId,
      tokenType: payload.tokenType,
    };

    return true;
  }
}
