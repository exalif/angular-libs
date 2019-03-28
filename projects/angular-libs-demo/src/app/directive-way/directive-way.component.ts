import { Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Ufile } from '../ufile';
import { NgxFileUploadOptions, NgxFileUploadControlEvent, NgxFileUploadState } from '../../../../ngx-file-upload/src/public_api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-directive-way',
  templateUrl: './directive-way.component.html'
})
export class DirectiveWayComponent implements OnDestroy {
  public control: NgxFileUploadControlEvent;
  public state: Observable<NgxFileUploadState>;
  public uploads: Ufile[];
  public options: NgxFileUploadOptions;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor() {
    this.uploads = [];
    this.options = {
      concurrency: 2,
      allowedTypes: 'image/*,video/*',
      url: `${environment.api}/upload?uploadType=ngx-file-upload`,
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

  public onUpload(uploadsOutStream: Observable<NgxFileUploadState>) {
    this.state = uploadsOutStream;

    uploadsOutStream.pipe(takeUntil(this.ngUnsubscribe)).subscribe((ufile: NgxFileUploadState) => {
      const index = this.uploads.findIndex(f => f.uploadId === ufile.uploadId);

      if (ufile.status === 'added') {
        this.uploads.push(new Ufile(ufile));
      } else {
        this.uploads[index].progress = ufile.progress;
        this.uploads[index].status = ufile.status;
      }
    });
  }


  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
