import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { format, parse } from 'node:path';
import { Readable } from 'node:stream';
import { S3_CLIENT_PROVIDER_TOKEN } from 'storage/constants/s3-client-provider-token.const';
import { DeletionFailedException } from 'storage/exceptions/deletion-failed.exception';
import { UploadFailedException } from 'storage/exceptions/upload-failed.exception';
import { STORAGE_MODULE_OPTIONS_TOKEN } from 'storage/storage.module-definition';
import { StorageModuleConfig } from 'storage/types/storage-module-config.type';
// @ts-expect-error --experimental-require-module
import mime from 'mime';
import { StorageTransferType } from 'storage/enums/storage-transfer-type.enum';
import { CopyFailedException } from 'storage/exceptions/copy-failed.exception';
import { DownloadFailedException } from 'storage/exceptions/download-failed.exception';
import { StorageDownloadParams } from 'storage/types/storage-download-params.type';
import { StorageDownloadReturn } from 'storage/types/storage-download-return.type';
import { Overwrite } from 'utility-types';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_MODULE_OPTIONS_TOKEN)
    private readonly options: StorageModuleConfig,
    @Inject(S3_CLIENT_PROVIDER_TOKEN)
    private readonly s3: S3Client,
  ) {}

  async upload(params: {
    file: string | Uint8Array | Buffer | Readable;
    filePath: string;
    preserveFileName?: boolean;
  }): Promise<string> {
    const { filePath, file: buffer, preserveFileName = false } = params;

    try {
      const mimeType = mime.getType(filePath);
      let fileKey: string = filePath;

      if (!preserveFileName) {
        const timestamp = Date.now();
        const parsedFilePath = parse(filePath);
        const { name: fileName } = parsedFilePath;

        fileKey = format({
          ...parsedFilePath,
          base: undefined,
          name: `${timestamp}-${fileName}`,
        });
      }

      const command = new PutObjectCommand({
        Bucket: this.options.bucket,
        Key: fileKey,
        Body: buffer,
        ...(mimeType && { ContentType: mimeType }),
      });

      await this.s3.send(command);

      return fileKey;
    } catch (error) {
      throw new UploadFailedException(filePath, { cause: error });
    }
  }

  async copy(params: {
    sourceKey: string;
    destinationKey: string;
  }): Promise<string> {
    try {
      const command = new CopyObjectCommand({
        CopySource: `${this.options.bucket}/${params.sourceKey}`,
        Bucket: this.options.bucket,
        Key: params.destinationKey,
      });

      await this.s3.send(command);

      return params.destinationKey;
    } catch (error) {
      throw new CopyFailedException(params.sourceKey, { cause: error });
    }
  }

  async download(
    params: Overwrite<
      StorageDownloadParams,
      { type: StorageTransferType.STREAM }
    >,
  ): Promise<Overwrite<StorageDownloadReturn, { data: Readable }>>;
  async download(
    params: Overwrite<
      StorageDownloadParams,
      { type: StorageTransferType.BUFFER }
    >,
  ): Promise<
    Overwrite<StorageDownloadReturn, { data: Buffer<ArrayBufferLike> }>
  >;
  async download(
    params: Omit<StorageDownloadParams, 'type'>,
  ): Promise<
    Overwrite<StorageDownloadReturn, { data: Buffer<ArrayBufferLike> }>
  >;
  async download(
    params: StorageDownloadParams,
  ): Promise<StorageDownloadReturn> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.options.bucket,
        Key: params.filePath,
        Range: params.range,
      });

      const abortController = new AbortController();
      const { signal: abortSignal } = abortController;
      const response = await this.s3.send(command, { abortSignal });

      if (!response.Body)
        throw new Error(`No body for file ${params.filePath}`);

      let data: Readable | Buffer | undefined;

      if (params.type === StorageTransferType.STREAM) {
        // @ts-expect-error @types/node (^22.10.2) has invalid web-stream type
        data = Readable.fromWeb(response.Body.transformToWebStream());
      } else if (params.type === StorageTransferType.BUFFER) {
        data = Buffer.from(await response.Body.transformToByteArray());
      } else {
        data = Buffer.from(await response.Body.transformToByteArray());
      }

      return {
        data,
        abortController,
        contentLength: response.ContentLength,
        contentType: response.ContentType,
        contentRange: response.ContentDisposition,
        acceptRanges: response.ContentRange,
        contentDisposition: response.AcceptRanges,
      };
    } catch (error) {
      throw new DownloadFailedException(params.filePath, { cause: error });
    }
  }

  async delete(fileKey: string | string[]): Promise<void> {
    const fileKeys = Array.isArray(fileKey) ? fileKey : [fileKey];

    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.options.bucket,
        Delete: { Objects: fileKeys.map((Key) => ({ Key })) },
      });

      await this.s3.send(command);
    } catch (error) {
      throw new DeletionFailedException(fileKeys, { cause: error });
    }
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const command = new ListObjectsCommand({
      Bucket: this.options.bucket,
      Prefix: prefix,
    });

    const { Contents: files } = await this.s3.send(command);

    const fileKeys = files
      ?.map((f) => f.Key)
      .filter((f): f is string => typeof f === 'string');

    if (fileKeys) await this.delete(fileKeys);
  }

  getSignedUrl = async (
    fileKey: string,
    isDownload: boolean = false,
  ): Promise<string> => {
    const command = new GetObjectCommand({
      Bucket: this.options.bucket,
      Key: fileKey,
      ...(isDownload && {
        ResponseContentDisposition: `attachment; filename="${parse(fileKey).base}"`,
      }),
    });

    const signedUrl = await getSignedUrl(this.s3, command);

    return signedUrl;
  };

  getPublicUrl = (fileKey: string): string => {
    return `https://${this.options.bucket}.s3.${this.options.region}.amazonaws.com/${fileKey}`;
  };
}
