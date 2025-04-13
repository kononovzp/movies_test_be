import type { HttpExceptionOptions } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

export class EmailIsAlreadyVerifiedException extends BadRequestException {
  constructor(email: string, options?: HttpExceptionOptions) {
    super(`Email '${email}' is already verified`, options);
  }
}

export const emailIsAlreadyVerifiedExceptionSample =
  new EmailIsAlreadyVerifiedException('user@example.com');
