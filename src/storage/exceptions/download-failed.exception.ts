import type { HttpExceptionOptions } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

export class DownloadFailedException extends InternalServerErrorException {
  constructor(fileName: string, options?: HttpExceptionOptions) {
    super(`Download of files '${fileName}' failed`, options);
  }
}

export const downloadFailedExceptionSample = new DownloadFailedException(
  'some-file-name.ext',
);
