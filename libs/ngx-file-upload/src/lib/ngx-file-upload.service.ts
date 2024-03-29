import { Injectable } from '@angular/core';

import { Observable, Subject, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  public queue: Uploader[] = [];

  private readonly eventsStream: Subject<NgxFileUploadState> = new Subject();
  private concurrency = 2;
  private autoUpload = true;
  private options: NgxFileUploadOptions;

  constructor() {
    this.events.subscribe((evt: NgxFileUploadEvent) => {
      if (evt.status !== 'uploading' && evt.status !== 'added') {
        this.processQueue();
      }
    });
  }

  public get events() {
    return this.eventsStream.asObservable();
  }

  public stateChange = (evt: NgxFileUploadState): void => {
    timer(100).subscribe(() => {
      this.eventsStream.next(evt);
    });
  };

  public get uploaderOptions(): NgxFileUploaderOptions {
    return {
      method: this.options.method || 'POST',
      endpoint: this.options.endpoint || this.options.url || '/upload',
      headers: this.options.headers,
      metadata: this.options.metadata,
      token: this.options.token,
      chunkSize: this.options.chunkSize,
      withCredentials: this.options.withCredentials,
      maxRetryAttempts: this.options.maxRetryAttempts,
      useDataFromPostResponseBody: this.options.useDataFromPostResponseBody,
      useBackendUploadId: this.options.useBackendUploadId,
      backendUploadIdName: this.options.backendUploadIdName || 'uploadId',
      useUploadIdAsUrlPath: this.options.useUploadIdAsUrlPath,
      useFormData: this.options.useFormData,
      formDataFileKey: this.options.formDataFileKey || 'file',
      breakRetryErrorCodes: this.options.breakRetryErrorCodes,
      chuckSuccessCodes: this.options.chuckSuccessCodes || [300],
      stateChange: this.stateChange,
    };
  }

  /**
   * Initializes service
   *
   * @param options global options
   * @returns Observable that emits a new value on progress or status changes
   */
  public init(options: NgxFileUploadOptions): Observable<NgxFileUploadState> {
    this.options = options;
    this.concurrency = options.concurrency || this.concurrency;
    this.autoUpload = !(options.autoUpload === false);

    return this.events;
  }

  /**
   * Initializes service
   *
   * @param options global options
   * @returns Observable that emits the current queue
   */
  public connect(options?: NgxFileUploadOptions): Observable<Uploader[]> {
    return this.init(options || this.options).pipe(
      startWith(0),
      map(() => this.queue)
    );
  }

  /**
   * Terminate all uploads and clears the queue
   */
  public disconnect(): void {
    this.queue.forEach(f => (f.status = 'paused'));
    this.queue = [];
  }

  /**
   *
   * Create Uploader and add to the queue
   */
  public async handleFileList(fileList: FileList, extraMetadata?: { [key: string]: any }) {
    for (let i = 0; i < fileList.length; i++) {
      let checkSum: string = null;

      if (this.options.checksumHashMethod) {
        checkSum = await this.options.checksumHashMethod(fileList.item(i));
      }

      const uploader: Uploader = new Uploader(fileList.item(i), this.uploaderOptions, checkSum, extraMetadata);
      this.queue.push(uploader);
      uploader.status = 'added';
    }

    this.autoUploadFiles();
  }

  /**
   * Create Uploader for the file and add to the queue
   */
  public async handleFile(file: File, extraMetadata?: { [key: string]: any }) {
    let checkSum: string = null;

    if (this.options.checksumHashMethod) {
      checkSum = await this.options.checksumHashMethod(file);
    }

    const uploader: Uploader = new Uploader(file, this.uploaderOptions, checkSum, extraMetadata);
    this.queue.push(uploader);
    uploader.status = 'added';

    this.autoUploadFiles();
  }

  /**
   * Get running processes number
   *
   * @returns  number of active uploads
   */

  public runningProcess(): number {
    return this.queue.filter(
      (uploader: Uploader) => uploader.status === 'uploading' || uploader.status === 'retry'
    ).length;
  }

  /**
   * Auto upload the files if the flag is true
   *
   * @internal
   */
  private autoUploadFiles(): void {
    if (this.autoUpload) {
      this.queue.filter(f => f.status === 'added').forEach(f => (f.status = 'queue'));
    }
  }

  /**
   * Control uploads status
   *
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
        this.queue.forEach(f => f.refreshToken(event.token));
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
   *
   * @internal
   */
  private processQueue(): void {
    // Remove Cancelled Items from local queue
    this.queue = this.queue.filter(f => f.status !== 'cancelled');

    const running = this.runningProcess();

    this.queue
      .filter((uploader: Uploader) => uploader.status === 'queue')
      .slice(0, Math.max(this.concurrency - running, 0))
      .forEach((uploader: Uploader) => {
        uploader.upload();
      });
  }
}
