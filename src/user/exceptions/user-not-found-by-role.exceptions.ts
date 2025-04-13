import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundByRoleException extends NotFoundException {
  constructor(role: string, options?: HttpExceptionOptions) {
    super(`User with role '${role}' not found`, options);
  }
}

export const userNotFoundByRoleExceptionSample =
  new UserNotFoundByRoleException('Admin');
