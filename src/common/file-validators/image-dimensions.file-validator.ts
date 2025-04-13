import { FileValidator } from '@nestjs/common';
import sharp from 'sharp';

export interface ImageDimensionsValidatorOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export class ImageDimensionsValidator extends FileValidator<
  ImageDimensionsValidatorOptions,
  Express.Multer.File
> {
  buildErrorMessage(): string {
    const { minWidth, minHeight, maxWidth, maxHeight } = this.validationOptions;
    const minDimensions = [minWidth ?? 'ANY', minHeight ?? 'ANY'].join('x');
    const maxDimensions = [maxWidth ?? 'ANY', maxHeight ?? 'ANY'].join('x');

    return `Validation failed (image dimensions must be between ${minDimensions} and ${maxDimensions})`;
  }

  async isValid(file?: Express.Multer.File): Promise<boolean> {
    if (!file) return true;

    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    return (
      (this.validationOptions.minWidth === undefined ||
        (metadata.width ?? 0) >= this.validationOptions.minWidth) &&
      (this.validationOptions.minHeight === undefined ||
        (metadata.height ?? 0) >= this.validationOptions.minHeight) &&
      (this.validationOptions.maxWidth === undefined ||
        (metadata.width ?? Infinity) <= this.validationOptions.maxWidth) &&
      (this.validationOptions.maxHeight === undefined ||
        (metadata.height ?? Infinity) <= this.validationOptions.maxHeight)
    );
  }
}
