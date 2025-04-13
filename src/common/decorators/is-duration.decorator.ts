import type {
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidatorConstraint, registerDecorator } from 'class-validator';
import parseDuration from 'parse-duration';

@ValidatorConstraint()
class IsDurationConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return (
      typeof value === 'string' && typeof parseDuration(value) === 'number'
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid string of "https://www.npmjs.com/package/parse-duration" library duration format (e.g., 2 hours, 15m, 1 year)`;
  }
}

export const IsDuration =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isDuration',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsDurationConstraint,
    });
  };
