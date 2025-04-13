import { NodeEnv } from 'environment/environment.enum';
import { environmentSchema } from 'environment/environment.schema';
import type { Env } from 'environment/environment.type';
import { fromZodError } from 'zod-validation-error';

export function environmentValidator(config: Record<string, unknown>): Env {
  const configWithoutEmptyStrings = Object.fromEntries(
    Object.entries(config).filter((entry) => entry[1] !== ''),
  );

  const result = environmentSchema.safeParse(configWithoutEmptyStrings);

  if (!result.success) {
    const message = fromZodError(result.error, {
      prefixSeparator: ':\n\t',
      issueSeparator: '\n\t',
    }).toString();

    throw new Error(message);
  }

  const { NODE_ENV } = result.data;

  const data = {
    ...result.data,
    isDevelopment: [NodeEnv.DEVELOPMENT].includes(NODE_ENV),
    isStaging: [NodeEnv.STAGING].includes(NODE_ENV),
    isProduction: [NodeEnv.PRODUCTION].includes(NODE_ENV),
  };

  return data;
}
