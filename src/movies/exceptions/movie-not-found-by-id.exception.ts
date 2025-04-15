import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export class MovieNotFoundByIdException extends NotFoundException {
  constructor(id: string, options?: HttpExceptionOptions) {
    super(`Movie with id '${id}' not found`, options);
  }
}

export const movieNotFoundByIdExceptionSample = new MovieNotFoundByIdException(
  '567ebabb-9b37-4ca2-ad2c-8e3f5026c1d7',
);
