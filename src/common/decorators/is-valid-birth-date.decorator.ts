import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { differenceInYears } from 'date-fns';

export const IsValidBirthDate =
  (minAge: number, maxAge: number, validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'IsValidBirthDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (!(value instanceof Date)) return false;

          const today = new Date();
          const age = differenceInYears(today, value);

          return age >= minAge && age <= maxAge;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Date representing a person's age between ${minAge.toString()} and ${maxAge.toString()} years`;
        },
      },
    });
  };
