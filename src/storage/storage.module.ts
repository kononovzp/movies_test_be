import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { S3_CLIENT_PROVIDER_TOKEN } from 'storage/constants/s3-client-provider-token.const';
import {
  STORAGE_MODULE_OPTIONS_TOKEN,
  StorageModuleConfigurableClass,
} from 'storage/storage.module-definition';
import { StorageService } from 'storage/storage.service';
import { StorageModuleConfig } from 'storage/types/storage-module-config.type';

@Module({
  providers: [
    {
      inject: [STORAGE_MODULE_OPTIONS_TOKEN],
      provide: S3_CLIENT_PROVIDER_TOKEN,
      useFactory: function (config: StorageModuleConfig): S3Client {
        return new S3Client({
          region: config.region,
          endpoint: config.endpoint,
          forcePathStyle: true, // Required to work with Localstack
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        });
      },
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule extends StorageModuleConfigurableClass {}
