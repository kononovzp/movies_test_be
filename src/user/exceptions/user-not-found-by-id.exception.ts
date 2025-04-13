import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class UserNotFoundByIdException extends NotFoundException {
  constructor(id: string, options?: HttpExceptionOptions) {
    super(`User with id '${id}' not found`, options);
  }
}

export const userNotFoundByIdExceptionSample = new UserNotFoundByIdException(
  randomUUID(),
);
