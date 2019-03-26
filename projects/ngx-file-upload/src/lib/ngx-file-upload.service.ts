import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Uploader } from './utils/uploader';
import { UploadState } from './models/upload-state';
import { UploadxOptions } from './models/upload-options';
import { UploaderOptions } from './models/uploader-options';
import { UploadEvent } from './models/upload-event';
import { UploadxControlEvent } from './models/control-event';
import { UploadStatus } from './models/upload-status';

/**
 *
 */
@Injectable({ providedIn: 'root' })
export class NgxFileUploadService {
  public eventsStream: Subject<UploadState> = new Subject();
  public queue: Uploader[] = [];

  private concurrency: number = 2;
  private autoUpload: boolean = true;
  private options: UploadxOptions;

  constructor() {
    this.eventsStream.subscribe((evt: UploadEvent) => {
      if (evt.status !== 'uploading' && evt.status !== 'added') {
        this.processQueue();
      }
    });
  }

  public stateChange(evt: UploadState): void {
    setTimeout(() => {
      this.eventsStream.next(evt);
    });
  }

  get uploaderOptions(): UploaderOptions {
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
  init(options: UploadxOptions): Observable<UploadState> {
    this.queue = [];
    this.options = options;
    this.concurrency = options.concurrency || this.concurrency;
    this.autoUpload = !(options.autoUpload === false);

    return this.eventsStream.asObservable();
  }

  /**
   * Create Uploader and add to the queue
   */
  public handleFileList(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      const uploader: Uploader = new Uploader(fileList.item(i), this.uploaderOptions);
      this.queue.push(uploader);
      uploader.status = 'added';
    }

    this.autoUploadFiles();
  }

  /**
   *
   * Create Uploader for the file and add to the queue
   */
  public handleFile(file: File): void {
    const uploader: Uploader = new Uploader(file, this.uploaderOptions);
    this.queue.push(uploader);
    uploader.status = 'added';

    this.autoUploadFiles();
  }

  /**
   * Get the number of running processes
   */
  public runningProcess(): number {
    return this.queue.filter(
      (uploader: Uploader) => uploader.status === 'uploading' || uploader.status === 'retry'
    ).length;
  }

  /**
   * Control uploads status
   * @example
   * this.uploadService.control({ action: 'pauseAll' });
   *
   */
  public control(event: UploadxControlEvent): void {
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
        upload.status = 'queue' as UploadStatus;
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
   * Auto upload the files if the flag is true
   */
  private autoUploadFiles(): void {
    if (this.autoUpload) {
      this.queue.filter(f => f.status === 'added').forEach(f => (f.status = 'queue'));
    }
  }

  /**
   * Queue management
   */
  private processQueue() {
    const running = this.runningProcess();

    this.queue
      .filter((uploader: Uploader) => uploader.status === 'queue')
      .slice(0, Math.max(this.concurrency - running, 0))
      .forEach((uploader: Uploader) => {
        uploader.upload();
      });
  }
}
