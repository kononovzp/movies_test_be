import type { HttpExceptionOptions } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

export class CopyFailedException extends InternalServerErrorException {
  constructor(fileName: string, options?: HttpExceptionOptions) {
    super(`Copy of file '${fileName}' failed`, options);
  }
}

export const copyFailedExceptionSample = new CopyFailedException(
  'some-file-name.ext',
);
