import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundByEmailException extends NotFoundException {
  constructor(email: string, options?: HttpExceptionOptions) {
    super(`User with email '${email}' not found`, options);
  }
}

export const userNotFoundByEmailExceptionSample =
  new UserNotFoundByEmailException('user@example.com');
