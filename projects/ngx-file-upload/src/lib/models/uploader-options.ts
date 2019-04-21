import { NgxFileUploadItem } from './upload-item';

export interface NgxFileUploaderOptions extends NgxFileUploadItem {
  maxRetryAttempts: number;
  chunkSize?: number;
  withCredentials?: boolean;
  useDataFromPostResponseBody?: boolean;
  useBackendUploadId?: boolean;
  useUploadIdAsUrlPath?: boolean;
  forceOctetStreamMimeType?: boolean;
  breakRetryErrorCode?: number;

  readonly stateChange?: any;
}
