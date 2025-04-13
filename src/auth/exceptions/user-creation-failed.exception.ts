import type { HttpExceptionOptions } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

export class UserCreationFailedException extends InternalServerErrorException {
  constructor(options?: HttpExceptionOptions) {
    super(`Failed to create user`, options);
  }
}

export const userCreationFailedExceptionSample =
  new UserCreationFailedException();
