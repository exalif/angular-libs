import { Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Ufile } from '../ufile';
import { UploadxOptions } from 'projects/ngx-file-upload/src/lib/models/upload-options';
import { UploadxControlEvent } from 'projects/ngx-file-upload/src/lib/models/control-event';
import { UploadState } from 'projects/ngx-file-upload/src/lib/models/upload-state';

@Component({
  selector: 'app-directive-way',
  templateUrl: './directive-way.component.html'
})
export class DirectiveWayComponent implements OnDestroy {
  public control: UploadxControlEvent;
  public state: Observable<UploadState>;
  public uploads: Ufile[];
  public options: UploadxOptions;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor() {
    this.uploads = [];
    this.options = {
      concurrency: 2,
      allowedTypes: 'image/*,video/*',
      url: `${environment.api}/upload?uploadType=uploadx`,
      token: () => {
        return 'sometoken';
      },
      metadata: (f: File) => ({ title: f.name }),
      autoUpload: true,
      withCredentials: false,
      chunkSize: 1024 * 256 * 8,
      headers: (f: File) => ({
        'Content-Disposition': `filename=${encodeURI(f.name)}`
      })
    };
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public cancelAll(): void {
    this.control = { action: 'cancelAll' };
  }

  public uploadAll(): void {
    this.control = { action: 'uploadAll' };
  }

  public pauseAll(): void {
    this.control = { action: 'pauseAll' };
  }

  public pause(uploadId: string): void {
    this.control = { action: 'pause', uploadId };
  }

  public upload(uploadId: string): void {
    this.control = { action: 'upload', uploadId };
  }

  public onUpload(uploadsOutStream: Observable<UploadState>): void {
    this.state = uploadsOutStream;

    uploadsOutStream.pipe(takeUntil(this.ngUnsubscribe)).subscribe((ufile: UploadState) => {
      const index = this.uploads.findIndex(f => f.uploadId === ufile.uploadId);

      if (ufile.status === 'added') {
        this.uploads.push(new Ufile(ufile));
      } else {
        this.uploads[index].progress = ufile.progress;
        this.uploads[index].status = ufile.status;
      }
    });
  }
}
