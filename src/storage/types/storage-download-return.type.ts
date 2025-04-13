import type { Readable } from 'node:stream';

export type StorageDownloadReturn = {
  data: Readable | Buffer<ArrayBufferLike>;
  abortController: AbortController;
  contentType?: string;
  contentLength?: number;
  contentRange?: string;
  acceptRanges?: string;
  contentDisposition?: string;
};
