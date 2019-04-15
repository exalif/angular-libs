import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxFileUploadOptions, NgxFileUploadState, NgxFileUploadService } from '../../../../ngx-file-upload/src/public-api';
import { environment } from '../../environments/environment';
import { Ufile } from '../ufile';
import { AuthService, tokenGetter } from '../auth.service';

@Component({
  selector: 'app-service-way',
  templateUrl: './service-way.component.html'
})
export class ServiceWayComponent implements OnDestroy, OnInit {
  public state: Observable<NgxFileUploadState>;
  public uploads: Ufile[] = [];
  public options: NgxFileUploadOptions = {
    url: `${environment.api}/upload`,
    token: tokenGetter,
    chunkSize: 1024 * 256 * 8
  };

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private uploadService: NgxFileUploadService,
    private auth: AuthService
  ) { }

  public ngOnInit(): void {
    const uploadsProgress = this.uploadService.init(this.options);
    this.onUpload(uploadsProgress);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public cancelAll(): void {
    this.uploadService.control({ action: 'cancelAll' });
  }

  public uploadAll(): void {
    this.uploadService.control({ action: 'uploadAll' });
  }

  public pauseAll(): void {
    this.uploadService.control({ action: 'pauseAll' });
  }

  public pause(uploadId: string): void {
    this.uploadService.control({ action: 'pause', uploadId });
  }

  public upload(uploadId: string): void {
    this.uploadService.control({ action: 'upload', uploadId });
  }

  public onUpload(uploadsOutStream: Observable<NgxFileUploadState>): void {
    this.state = uploadsOutStream;

    uploadsOutStream.pipe(takeUntil(this.ngUnsubscribe)).subscribe((item: NgxFileUploadState) => {
      const index = this.uploads.findIndex(f => f.uploadId === item.uploadId);

      if (item.status === 'added') {
        this.uploads.push(new Ufile(item));
      } else if (item.status === 'retry' && item.responseStatus === 401) {
        this.auth.refresh().subscribe(token => console.log('refreshed token: ', token));
      } else {
        this.uploads[index].progress = item.progress;
        this.uploads[index].status = item.status;
      }
    });
  }
}