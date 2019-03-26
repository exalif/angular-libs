import { UploadState } from '../../../ngx-file-upload/src/lib/models/upload-state';

export class Ufile {
  name: string;
  uploadId: string;
  progress: number;
  status: string;
  constructor(ufile: UploadState) {
    this.uploadId = ufile.uploadId;
    this.name = ufile.name;
    this.progress = ufile.progress;
    this.status = ufile.status;
  }
}
