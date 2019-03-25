import { UploadItem } from './upload-item';

export interface UploaderOptions extends UploadItem {
  maxRetryAttempts: number;
  chunkSize?: number;
  withCredentials?: boolean;
  readonly stateChange?: any;
}
