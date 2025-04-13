import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class CoUsersGroupNotFoundByIdException extends NotFoundException {
  constructor(id: string, options?: HttpExceptionOptions) {
    super(`Co-users-group with id '${id}' not found`, options);
  }
}

export const coUsersGroupNotFoundByIdExceptionSample =
  new CoUsersGroupNotFoundByIdException(randomUUID());
