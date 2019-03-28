import { Injectable } from '@angular/core';

import { Observable, Subject, timer } from 'rxjs';

import { Uploader } from './utils/uploader';
import { NgxFileUploadState } from './models/upload-state';
import { NgxFileUploadOptions } from './models/upload-options';
import { NgxFileUploaderOptions } from './models/uploader-options';
import { NgxFileUploadEvent } from './models/upload-event';
import { NgxFileUploadControlEvent } from './models/control-event';
import { NgxFileUploadStatus } from './models/upload-status';

/**
 *
 */
@Injectable({ providedIn: 'root' })
export class NgxFileUploadService {
  public eventsStream: Subject<NgxFileUploadState> = new Subject();
  public queue: Uploader[] = [];

  private concurrency: number = 2;
  private autoUpload: boolean = true;
  private options: NgxFileUploadOptions;

  constructor() {
    this.eventsStream.subscribe((evt: NgxFileUploadEvent) => {
      if (evt.status !== 'uploading' && evt.status !== 'added') {
        this.processQueue();
      }
    });
  }

  public stateChange = (evt: NgxFileUploadState): void => {
    timer().subscribe(() => {
      this.eventsStream.next(evt);
    });
  }

  public get uploaderOptions(): NgxFileUploaderOptions {
    return {
      method: this.options.method || 'POST',
      endpoint: this.options.endpoint || this.options.url || '/upload/',
      headers: this.options.headers,
      metadata: this.options.metadata,
      token: this.options.token,
      chunkSize: this.options.chunkSize,
      withCredentials: this.options.withCredentials,
      maxRetryAttempts: this.options.maxRetryAttempts,
      stateChange: this.stateChange
    };
  }

  /**
   * Set global options
   */
  public init(options: NgxFileUploadOptions): Observable<NgxFileUploadState> {
    this.queue = [];
    this.options = options;
    this.concurrency = options.concurrency || this.concurrency;
    this.autoUpload = !(options.autoUpload === false);

    return this.eventsStream.asObservable();
  }

  /**
   *
   * Create Uploader and add to the queue
   */
  public handleFileList(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      const uploader: Uploader = new Uploader(fileList.item(i), this.uploaderOptions);
      this.queue.push(uploader);
      uploader.status = 'added';
    }

    this.autoUploadFiles();
  }

  /**
   * Create Uploader for the file and add to the queue
   */
  public handleFile(file: File): void {
    const uploader: Uploader = new Uploader(file, this.uploaderOptions);
    this.queue.push(uploader);
    uploader.status = 'added';

    this.autoUploadFiles();
  }

  /**
   * Get running processes number
   */

  public runningProcess(): number {
    return this.queue.filter(
      (uploader: Uploader) => uploader.status === 'uploading' || uploader.status === 'retry'
    ).length;
  }

  /**
   *
   * Auto upload the files if the flag is true
   */
  private autoUploadFiles(): void {
    if (this.autoUpload) {
      this.queue.filter(f => f.status === 'added').forEach(f => (f.status = 'queue'));
    }
  }

  /**
   * Control uploads status
   * @example
   * this.uploadService.control({ action: 'pauseAll' });
   *
   */
  public control(event: NgxFileUploadControlEvent): void {
    switch (event.action) {
      case 'cancelAll':
        this.queue.forEach(f => (f.status = 'cancelled'));
        break;
      case 'pauseAll':
        this.queue.forEach(f => (f.status = 'paused'));
        break;
      case 'refreshToken':
        this.queue.forEach(f => (f.options.token = event.token));
        break;
      case 'uploadAll':
        this.queue.filter(f => f.status !== 'uploading').forEach(f => (f.status = 'queue'));
        break;
      case 'upload':
        const uploadId = event.uploadId || event.itemOptions.uploadId;
        const upload = this.queue.find(f => f.uploadId === uploadId);
        upload.configure(event.itemOptions);
        upload.status = 'queue' as NgxFileUploadStatus;
        break;
      case 'cancel':
        this.queue.find(f => f.uploadId === event.uploadId).status = 'cancelled';
        break;
      case 'pause':
        this.queue.find(f => f.uploadId === event.uploadId).status = 'paused';
        break;
      default:
        break;
    }
  }

  /**
   * Queue management
   */
  private processQueue(): void {
    const running = this.runningProcess();

    this.queue
      .filter((uploader: Uploader) => uploader.status === 'queue')
      .slice(0, Math.max(this.concurrency - running, 0))
      .forEach((uploader: Uploader) => {
        uploader.upload();
      });
  }
}
