// @ts-expect-error --experimental-require-module
import { pascalCase } from 'change-case';
import { ZOD_MS_TYPE } from 'environment/constants/zod-ms-type.const';
import { ZOD_PORT_TYPE } from 'environment/constants/zod-port-type.const';
import { NodeEnv } from 'environment/environment.enum';
import { z } from 'zod';

export const environmentSchema = z
  .object({
    PROJECT_NAME: z
      .string()
      .default(pascalCase(process.env.npm_package_name ?? 'PROJECT')),
    NODE_ENV: z.nativeEnum(NodeEnv),
    PORT: ZOD_PORT_TYPE.default(3232),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: ZOD_PORT_TYPE.default(5432),
    DB_USERNAME: z.string().default('postgres'),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string().default('postgres'),
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: ZOD_PORT_TYPE.default(6379),
    REDIS_PASSWORD: z.string().default(''),
    SESSION_SECRET: z.string(),
    JWT_SECRET: z.string(),
    JWT_ACCESS_TOKEN_EXPIRES_IN: ZOD_MS_TYPE.default('15m'),
    JWT_REFRESH_TOKEN_EXPIRES_IN: ZOD_MS_TYPE.default('8h'),
    SESSION_DURATION: ZOD_MS_TYPE.default('1h'),
    SESSION_REMEMBER_DURATION: ZOD_MS_TYPE.default('7d'),
    REQUEST_ENTITY_SIZE_LIMIT: z.string().default('15mb'),
    AUTHORIZATION_THROTTLE_TTL: ZOD_MS_TYPE.default('1m'),
    AUTHORIZATION_THROTTLE_LIMIT: z.coerce.number().default(10),
    PASSWORD_SALT_ROUNDS: z.coerce.number().min(6).default(12),
    RESET_PASSWORD_TOKEN_EXPIRE_IN: ZOD_MS_TYPE.default('1d'),
    RESET_PASSWORD_TOKEN_RESEND_IN: ZOD_MS_TYPE.default('30s'),
    EMAIL_VERIFICATION_TOKEN_EXPIRE_IN: ZOD_MS_TYPE.default('1d'),
    EMAIL_VERIFICATION_TOKEN_RESEND_IN: ZOD_MS_TYPE.default('30s'),

    API_GLOBAL_PREFIX: z.string().default('api'),
    DOCS_PATH: z.string().default('docs'),
    SMTP_HOST: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_FROM: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_DEFAULT_REGION: z.string(),
    AWS_DEFAULT_ENDPOINT: z.string().optional(),
    AWS_S3_BUCKET: z.string(),
    AWS_SMS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SMS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_SMS_REGION: z.string().optional(),
  })
  .transform((schema) => ({
    ...schema,
    AWS_SMS_ACCESS_KEY_ID:
      schema.AWS_SMS_ACCESS_KEY_ID ?? schema.AWS_ACCESS_KEY_ID,
    AWS_SMS_SECRET_ACCESS_KEY:
      schema.AWS_SMS_SECRET_ACCESS_KEY ?? schema.AWS_SECRET_ACCESS_KEY,
    AWS_SMS_REGION: schema.AWS_SMS_REGION ?? schema.AWS_DEFAULT_REGION,
  }));
