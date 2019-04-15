import { NgxFileUploadItem } from './upload-item';

export interface NgxFileUploaderOptions extends NgxFileUploadItem {
  maxRetryAttempts: number;
  chunkSize?: number;
  withCredentials?: boolean;
  useBackendUploadId?: boolean;
  useUploadIdAsUrlPath?: boolean;
  forceOctetStreamMimeType?: boolean;

  readonly stateChange?: any;
}