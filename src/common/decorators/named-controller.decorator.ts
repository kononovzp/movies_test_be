import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function NamedController(name: string): ClassDecorator {
  return applyDecorators(Controller(name), ApiTags(name));
}
