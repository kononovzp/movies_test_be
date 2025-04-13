import { FileValidator } from '@nestjs/common';
// @ts-expect-error --experimental-require-module
import { fileTypeFromBuffer } from 'file-type';

export interface FileTypeValidatorOptions {
  type: string;
}

export class FileTypeValidator extends FileValidator<
  FileTypeValidatorOptions,
  Express.Multer.File
> {
  buildErrorMessage(): string {
    return 'Invalid file type';
  }

  async isValid(file?: Express.Multer.File): Promise<boolean> {
    if (!file) return true;

    const fileType = await fileTypeFromBuffer(file.buffer);

    if (!fileType) return false;

    if (!new RegExp(this.validationOptions.type).test(fileType.mime))
      return false;

    return true;
  }
}
