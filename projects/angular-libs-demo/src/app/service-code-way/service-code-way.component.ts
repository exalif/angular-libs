import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Ufile } from '../ufile';
import { UploadState } from 'projects/ngx-file-upload/src/lib/models/upload-state';
import { UploadxOptions } from 'projects/ngx-file-upload/src/lib/models/upload-options';
import { NgxFileUploadService } from 'projects/ngx-file-upload/src/lib/ngx-file-upload.service';

@Component({
  selector: 'app-service-way',
  templateUrl: './service-code-way.component.html'
})
export class ServiceCodeWayComponent implements OnDestroy, OnInit {
  public state: Observable<UploadState>;
  public uploads: Ufile[] = [];
  public options: UploadxOptions = {
    concurrency: 2,
    url: `${environment.api}/upload?uploadType=uploadx`,
    token: 'someToken',
    autoUpload: true,
    chunkSize: 1024 * 256 * 8
  };
  public numberOfCopies = 0;

  private ngUnsubscribe: Subject<any> = new Subject();

  @ViewChild('file', { read: ElementRef }) public fileInput: ElementRef;

  constructor(
    private uploadService: NgxFileUploadService
  ) { }

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

  public onUpload(uploadsOutStream: Observable<UploadState>): void {
    this.state = uploadsOutStream;

    uploadsOutStream.pipe(takeUntil(this.ngUnsubscribe)).subscribe((item: UploadState) => {
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
