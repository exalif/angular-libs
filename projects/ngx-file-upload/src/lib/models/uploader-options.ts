import { NgxFileUploadItem } from './upload-item';

export interface NgxFileUploaderOptions extends NgxFileUploadItem {
  maxRetryAttempts: number;
  chunkSize?: number;
  withCredentials?: boolean;
  useDataFromPostResponseBody?: boolean;
  useBackendUploadId?: boolean;
  useUploadIdAsUrlPath?: boolean;
  useFormData?: boolean;
  breakRetryErrorCode?: number;
  formDataFileKey?: string;

  readonly stateChange?: any;
}
