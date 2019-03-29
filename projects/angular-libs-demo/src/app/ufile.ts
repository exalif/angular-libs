import { NgxFileUploadState } from '../../../ngx-file-upload/src/public-api';

export class Ufile {
  name: string;
  uploadId: string;
  progress: number;
  status: string;
  constructor(ufile: NgxFileUploadState) {
    this.uploadId = ufile.uploadId;
    this.name = ufile.name;
    this.progress = ufile.progress;
    this.status = ufile.status;
  }
}
