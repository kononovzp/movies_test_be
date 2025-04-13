import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'app.service';
import { AuthModule } from 'auth/auth.module';

import { LogMiddleware } from 'common/middlewares/log.middleware';

import { dataSourceOptions } from 'database/data-source-options';

import { Env } from 'environment/environment.type';
import { environmentValidator } from 'environment/environment.validator';
import { MoviesModule } from 'movies/movies.module';
import { StorageModule } from 'storage/storage.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: environmentValidator, isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService<Env, true>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
      }),
      inject: [ConfigService],
    }),
    StorageModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        region: configService.get('AWS_DEFAULT_REGION', { infer: true }),
        bucket: configService.get('AWS_S3_BUCKET', { infer: true }),
        endpoint: configService.get('AWS_DEFAULT_ENDPOINT', { infer: true }),
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY', {
          infer: true,
        }),
      }),
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    MoviesModule,
  ],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  configure(consumer: MiddlewareConsumer): void {
    if (!this.configService.get('isProduction'))
      consumer.apply(LogMiddleware).forRoutes('*');
  }
}
