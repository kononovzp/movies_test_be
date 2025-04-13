import { Transform } from 'class-transformer';

export function ParseOptionalBooleanString(): PropertyDecorator {
  return Transform(({ value }) => {
    const map = new Map([
      ['undefined', undefined],
      ['true', true],
      ['false', false],
    ]);
    if (typeof value === 'string') return map.get(value);
    return value as unknown;
  });
}
