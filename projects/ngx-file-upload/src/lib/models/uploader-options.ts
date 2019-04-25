import { NgxFileUploadItem } from './upload-item';

export interface NgxFileUploaderOptions extends NgxFileUploadItem {
  maxRetryAttempts: number;
  chunkSize?: number;
  withCredentials?: boolean;
  noRequeueOn404?: boolean;
  useDataFromPostResponseBody?: boolean;
  useBackendUploadId?: boolean;
  useUploadIdAsUrlPath?: boolean;
  useFormData?: boolean;
  breakRetryErrorCode?: number;
  formDataFileKey?: string;

  readonly stateChange?: any;
}
