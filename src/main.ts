import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'app.module';

import { HttpExceptionFilter } from 'common/exception-filters/http-exception.filter';
import { ValidationException } from 'common/exceptions/validation.exception';
import type { Env } from 'environment/environment.type';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService<Env, true>);
  const isProduction = configService.get('isProduction', { infer: true });
  const projectName = configService.get('PROJECT_NAME', { infer: true });
  const port = configService.get('PORT', { infer: true });
  const docsPath = configService.get('DOCS_PATH', { infer: true });
  const requestEntitySizeLimit = configService.get(
    'REQUEST_ENTITY_SIZE_LIMIT',
    { infer: true },
  );
  const apiGlobalPrefix = configService.get('API_GLOBAL_PREFIX', {
    infer: true,
  });

  if (isProduction) app.useLogger(['fatal', 'error']);

  const corsSettings: CorsOptions = { origin: /^.*$/, credentials: true };

  app.enableCors(corsSettings);
  app.setGlobalPrefix(apiGlobalPrefix);
  app.useBodyParser('json', { limit: requestEntitySizeLimit });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      validateCustomDecorators: true,
      exceptionFactory: (errors): ValidationException =>
        new ValidationException(errors),
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  app.use(helmet());

  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${projectName} API Documentation`)
      .setDescription(
        'A package that generates typescript interfaces and api client based on swagger documentation: ' +
          '<a href="https://www.npmjs.com/package/swagger-typescript-api" target="_blank">swagger-typescript-api</a>. ' +
          `JSON schema can be found <a href="/${docsPath}-json" target="_blank">here</a>.`,
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(docsPath, app, document);
  }

  await app.listen(port);
}

void bootstrap();
