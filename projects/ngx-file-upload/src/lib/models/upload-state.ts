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
  size: number;
  speed: number;
  status: NgxFileUploadStatus;
  uploadId: string;
  URI: string;
}
