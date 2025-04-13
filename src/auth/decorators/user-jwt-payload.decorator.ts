import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_PAYLOAD_FIELD } from 'auth/constants/request-user-payload-field.const';

export const UserJwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request[REQUEST_USER_PAYLOAD_FIELD];
  },
);
