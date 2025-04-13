import { applyDecorators } from '@nestjs/common';
import { IsStrongPassword } from 'class-validator';

export const StrongPasswordValidator = (): ReturnType<typeof applyDecorators> =>
  applyDecorators(
    IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    }),
  );
