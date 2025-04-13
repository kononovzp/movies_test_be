import type { HttpExceptionOptions } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

export class IncorrectEmailOrPasswordException extends UnauthorizedException {
  constructor(options?: HttpExceptionOptions) {
    super(`Email or password is incorrect`, options);
  }
}
