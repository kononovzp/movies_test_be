import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export const IsName = (): ReturnType<typeof applyDecorators> =>
  applyDecorators(IsString(), Length(2, 50));
