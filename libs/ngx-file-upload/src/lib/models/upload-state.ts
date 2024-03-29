import { NgxFileUploadStatus } from './upload-status';

export interface NgxFileUploadState {
  file: File;
  name: string;
  progress: number;
  percentage: number;
  remaining: number;
  response: any;
  responseStatus: number;
  responseStatusText: string;
  uploaded: number;
  size: number;
  speed: number;
  status: NgxFileUploadStatus;
  uploadId: string;
  chunkCount: number;

  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  URI: string;
}
