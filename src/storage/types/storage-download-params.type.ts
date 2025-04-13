import type { StorageTransferType } from 'storage/enums/storage-transfer-type.enum';

export type StorageDownloadParams = {
  filePath: string;
  range?: string;
  type?: StorageTransferType;
};
