import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxFileUploadOptions, NgxFileUploadState, NgxFileUploadService } from '../../../../ngx-file-upload/src/public-api';
import { environment } from '../../environments/environment';
import { Ufile } from '../ufile';

@Component({
  selector: 'app-service-way',
  templateUrl: './service-code-way.component.html'
})
export class ServiceCodeWayComponent implements OnDestroy, OnInit {
  public state: Observable<NgxFileUploadState>;
  public uploads: Ufile[] = [];
  public options: NgxFileUploadOptions = {
    concurrency: 2,
    url: `${environment.api}/upload?uploadType=ngx-file-upload`,
    token: 'someToken',
    autoUpload: true,
    chunkSize: 1024 * 256 * 8
  };
  public numberOfCopies: number = 0;

  private ngUnsubscribe: Subject<any> = new Subject();

  @ViewChild('file', { read: ElementRef, static: true }) public fileInput: ElementRef;

  constructor(private uploadService: NgxFileUploadService) { }

  public ngOnInit(): void {
    const uploadsProgress = this.uploadService.init(this.options);
    this.onUpload(uploadsProgress);
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

  public onChange(): void {
    const files = this.getFiles();
    for (let i = 0; i < files.length; i++) {
      this.uploadService.handleFile(files[i]);
    }
  }

  public getFiles(): FileList {
    return this.fileInput.nativeElement.files;
  }

  public onUpload(uploadsOutStream: Observable<NgxFileUploadState>): void {
    this.state = uploadsOutStream;

    uploadsOutStream.pipe(takeUntil(this.ngUnsubscribe)).subscribe((item: NgxFileUploadState) => {
      this.numberOfCopies = this.uploadService.runningProcess();
      const index = this.uploads.findIndex(f => f.uploadId === item.uploadId);

      if (item.status === 'added') {
        this.uploads.push(new Ufile(item));
      } else {
        this.uploads[index].progress = item.progress;
        this.uploads[index].status = item.status;
      }
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
