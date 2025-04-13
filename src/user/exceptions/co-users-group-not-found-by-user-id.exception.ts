import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class CoUsersGroupNotFoundByUserIdException extends NotFoundException {
  constructor(id: string, options?: HttpExceptionOptions) {
    super(`Co-users-group with user '${id}' not found`, options);
  }
}

export const coUsersGroupNotFoundByUserIdExceptionSample =
  new CoUsersGroupNotFoundByUserIdException(randomUUID());
