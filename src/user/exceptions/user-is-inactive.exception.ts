import { ForbiddenException, type HttpExceptionOptions } from '@nestjs/common';

export class UserIsInactiveException extends ForbiddenException {
  constructor(options?: HttpExceptionOptions) {
    super(`User is inactive`, options);
  }
}
