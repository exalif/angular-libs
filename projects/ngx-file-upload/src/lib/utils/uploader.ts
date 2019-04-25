/**
 * Implements XHR/CORS Resumable Upload
 * @see
 * https://developers.google.com/drive/v3/web/resumable-upload
 */

import { resolveUrl } from './resolve-url';
import { BackoffRetry } from './backoff-retry';
import { noop } from './noop';
import { unfunc } from './unfunc';
import { parseJson } from './parse-json';
import { getKeyFromResponse } from './get-key-from-response';

import { NgxFileUploadStatus } from '../models/upload-status';
import { NgxFileUploadItem } from '../models/upload-item';
import { NgxFileUploadState } from '../models/upload-state';
import { NgxFileUploaderOptions } from '../models/uploader-options';

export class Uploader {
  public headers: { [key: string]: string } | null;
  public metadata: { [key: string]: any };
  public extraMetadata: { [key: string]: any };
  public endpoint: string;
  public progress: number;
  public remaining: number;
  public response: any;
  public responseStatus: number;
  public responseStatusText: any;
  public speed: number;
  public URI: string;
  public uploadId: string;
  public token: string | (() => string);

  public readonly mimeType: string;
  public readonly name: string;
  public readonly size: number;
  public readonly checkSum: string;

  private _status: NgxFileUploadStatus;
  private retry = new BackoffRetry();
  private startTime: number;
  private statusType: number;
  private _token: string;
  private _xhr_: XMLHttpRequest;
  private chunkSize: number;
  private chunksCount: number;
  private noRequeueOn404: boolean;
  private useDataFromPostResponseBody: boolean;
  private useBackendUploadId: boolean;
  private useUploadIdAsUrlPath: boolean;
  private useFormData: boolean;
  private formDataFileKey: string;
  private useChunksIndexes: boolean = false;
  private currentChunkIndex: number;
  private maxRetryAttempts: number = 3;
  private breakRetryErrorCode: number;
  private stateChange: (evt: NgxFileUploadState) => void;

  set status(status: NgxFileUploadStatus) {
    // Return if State is cancelled or complete (but allow cancel of an complete upload to remove from list and from server)
    if (this._status === 'cancelled' || (this._status === 'complete' && status !== 'cancelled')) {
      return;
    }
    if (status !== this._status) {
      if (this._xhr_ && (status === 'cancelled' || status === 'paused')) {
        this._xhr_.abort();
      }
      if (status === 'cancelled' && this.URI) {
        this.request('delete');
      }
      this._status = status;
      this.notifyState();
    }
  }

  get status() {
    return this._status;
  }

  /**
   * Creates an instance of Uploader.
   */
  constructor(private readonly file: File, public options: NgxFileUploaderOptions, checkSum: string = null, extraMetadata: { [key: string]: any } = {}) {
    this.name = file.name;
    this.size = file.size;
    this.checkSum = checkSum;
    this.mimeType = file.type || 'application/octet-stream';
    this.stateChange = options.stateChange || noop;
    this.extraMetadata = extraMetadata;

    this.configure(options);
  }

  /**
   * configure or reconfigure uploader
   */
  public configure(item = {} as NgxFileUploadItem): void {
    const { metadata, headers, token, endpoint } = item;

    if (!this.useBackendUploadId) {
      this.uploadId = Math.random()
        .toString(36)
        .substring(2, 15);
    }

    const { uploadType } = this.extraMetadata;

    this.metadata = {
      name: this.name,
      checksum: this.checkSum,
      mimeType: this.mimeType,
      size: this.file.size,
      uploadType,
      lastModified: this.file.lastModified,
      ...unfunc(metadata || this.metadata, this.file)
    };
    this.endpoint = endpoint || this.options.endpoint;
    this.useDataFromPostResponseBody = this.options.useDataFromPostResponseBody || false;
    this.useBackendUploadId = this.options.useBackendUploadId || false;
    this.useUploadIdAsUrlPath = this.options.useUploadIdAsUrlPath || false;
    this.useFormData = this.options.useFormData || false;
    this.formDataFileKey = this.options.formDataFileKey || 'file';
    this.breakRetryErrorCode = this.options.breakRetryErrorCode || null;
    this.chunkSize = this.options.chunkSize;
    this.maxRetryAttempts = this.options.maxRetryAttempts || this.maxRetryAttempts;
    this.noRequeueOn404 = this.options.noRequeueOn404 || false;
    this.refreshToken(token);
    this.headers = { ...this.headers, ...unfunc(headers, this.file) };
  }

  public refreshToken(token?: any): void {
    this.token = token || this.token;
    this._token = unfunc(this.token);
  }

  /**
   * Initiate upload
   */
  public async upload(item?: NgxFileUploadItem | undefined): Promise<void> {
    if (item) {
      this.configure(item);
    }

    if (this._status === 'cancelled' || this._status === 'complete' || this._status === 'paused') {
      return;
    }

    this.status = 'uploading';
    this.refreshToken();

    try {
      await this.create();
      this.startTime = new Date().getTime();
      this.sendChunk(this.progress ? undefined : 0);
    } catch (e) {
      if (this.maxAttemptsReached() || (!!this.breakRetryErrorCode && !!e && this.breakRetryErrorCode === e)) {
        this.status = 'error';
      } else {
        this.status = 'retry';
        await this.retry.wait(this.responseStatus);
        this.status = 'queue';
      }
    }
  }

  public request(method: string, payload = null): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open(method.toUpperCase(), this.URI, true);
      this.setupXHR(xhr);
      xhr.onload = () => {
        this.processResponse(xhr);
        resolve();
      };
      xhr.onerror = () => reject();
      const body = payload ? JSON.stringify(payload) : null;
      xhr.send(body);
    });
  }

  /**
   * Emit current state
   */
  private notifyState(): void {
    const state: NgxFileUploadState = {
      file: this.file,
      name: this.name,
      progress: this.progress,
      percentage: this.progress,
      remaining: this.remaining,
      response: this.response,
      responseStatus: this.responseStatus,
      responseStatusText: this.responseStatusText,
      size: this.size,
      speed: this.speed,
      status: this._status,
      uploadId: this.uploadId,
      URI: this.URI
    };

    this.stateChange(state);
  }

  private processResponse(xhr: XMLHttpRequest): void {
    this.responseStatus = xhr.status;
    this.responseStatusText = xhr.statusText
    this.response = parseJson(xhr);
    this.statusType = xhr.status - (xhr.status % 100);
  }

  private maxAttemptsReached(): boolean | never {
    if (this.maxRetryAttempts !== 0 && this.retry.retryAttempts === this.maxRetryAttempts && this.statusType
      >= 400) {
      this.retry.reset();
      console.error(
        `Error: Maximum number of retry attempts reached:
          file: ${this.name},
          statusCode: ${this.responseStatus}`
      );

      return true;
    }
  }

  private create(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.URI || this.responseStatus === 404) {
        // get file URI
        const xhr: XMLHttpRequest = new XMLHttpRequest();

        xhr.open(this.options.method.toUpperCase(), this.endpoint, true);

        this.setupXHR(xhr);

        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('X-Upload-Content-Length', this.size.toString());
        xhr.setRequestHeader('X-Upload-Content-Type', this.mimeType);

        xhr.onload = () => {
          this.processResponse(xhr);
          const location: string = getKeyFromResponse(xhr, 'location');
          const uploadId: string = getKeyFromResponse(xhr, 'uploadId', this.useDataFromPostResponseBody);
          const chunksCount: number = +getKeyFromResponse(xhr, 'chunksCount', this.useDataFromPostResponseBody);

          const shouldReturnError = this.statusType !== 200
            || (!location && !this.useUploadIdAsUrlPath)
            || (!uploadId && this.useBackendUploadId)
            || (!this.uploadId && !uploadId && this.useUploadIdAsUrlPath);

          if (shouldReturnError) {
            // limit attempts
            this.statusType = 400;
            reject();
          } else {
            if (!!chunksCount) {
              this.calculateChunksSize(chunksCount);
              this.useChunksIndexes = true;
              this.currentChunkIndex = 0;
              this.chunksCount = chunksCount;
            }

            if (this.useBackendUploadId) {
              this.uploadId = uploadId;
            }

            if (this.useUploadIdAsUrlPath) {
              this.URI = `${this.endpoint}/${this.uploadId}`;
            } else {
              this.URI = resolveUrl(location, this.endpoint);
            }

            this.retry.reset();

            resolve();
          }
        };

        xhr.onerror = () => reject(xhr.status);
        xhr.send(JSON.stringify(this.metadata));
      } else {
        resolve();
      }
    });
  }

  /**
   * Chunk upload +/ get offset
   */
  private sendChunk(offset?: number): void {
    if (this.status === 'uploading') {
      let body = null;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.open('PUT', this.URI, true);
      this.setupXHR(xhr);
      this.setupEvents(xhr);

      offset = this.useChunksIndexes ? this.currentChunkIndex * this.chunkSize : offset;

      if (offset >= 0 && offset < this.size) {
        let end = this.chunkSize ? Math.min(offset + this.chunkSize, this.size) : this.size;
        let progressEnd = end;

        if (this.isIndexChunkingWithNoRest()) {
          end++;
        }

        body = (!!this.chunksCount && this.chunksCount === 1) || (offset === 0 && end === this.size + 1)
          ? this.file
          : this.file.slice(offset, end);

        if (this.useFormData) {
          const formData = new FormData();
          formData.append(this.formDataFileKey, body, this.name);
          body = formData;
        }

        xhr.upload.onprogress = this.setupProgressEvent(offset, progressEnd);

        if (this.useChunksIndexes) {
          xhr.setRequestHeader('X-Upload-Chunk-Index', this.currentChunkIndex.toString());
        }

        if (!this.useFormData) {
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        }

        xhr.setRequestHeader('Content-Range', `bytes ${offset}-${end - 1}/${this.size}`);
      } else {
        xhr.setRequestHeader('Content-Range', `bytes */${this.size}`);
      }

      xhr.send(body);
    }
  }

  private setupEvents(xhr: XMLHttpRequest): void {
    const onError = async () => {
      if (this.maxAttemptsReached() || (!!this.breakRetryErrorCode && xhr.status === this.breakRetryErrorCode)) {
        this.status = 'error';
        return;
      }

      this.status = 'retry';
      await this.retry.wait(xhr.status);

      if (xhr.status === 404 && this.noRequeueOn404) {
        this.status = 'uploading';
      }

      if (xhr.status === 404 && !this.noRequeueOn404) {
        this.status = 'queue';
        return;
      }

      if (xhr.status === 413) {
        this.chunkSize /= 2;
      }

      this.refreshToken();
      this.status = 'uploading';

      // request offset
      this.sendChunk();
    };

    const onSuccess = () => {
      this.processResponse(xhr);
      const offset = this.statusType === 300 && this.getNextChunkOffset(xhr);

      if (typeof offset === 'number' || (this.statusType === 300 && this.canGoToNextIndexChunk())) {
        //  next chunk
        if (this.useChunksIndexes) {
          this.currentChunkIndex++;
        }

        this.retry.reset();
        this.sendChunk(offset);
      } else if (this.statusType === 200) {
        this.progress = 100;
        this.status = 'complete';
      } else {
        onError();
      }
    };

    xhr.onerror = onError;
    xhr.onload = onSuccess;
  }

  private setupProgressEvent(offset: number, end: number) {
    return (pEvent: ProgressEvent) => {
      const uploaded = pEvent.lengthComputable
        ? offset + (end - offset) * (pEvent.loaded / pEvent.total)
        : offset;
      this.progress = +((uploaded / this.size) * 100).toFixed(2);
      const now = new Date().getTime();
      this.speed = Math.round((uploaded / (now - this.startTime)) * 1000);
      this.remaining = Math.ceil((this.size - uploaded) / this.speed);

      this.notifyState();
    };
  }

  private getNextChunkOffset(xhr: XMLHttpRequest): number {
    const str = getKeyFromResponse(xhr, 'Range');
    const [match] = str && str.match(/(-1|\d+)$/g);
    return match && +match + 1;
  }

  private canGoToNextIndexChunk(): boolean {
    return this.useChunksIndexes && this.currentChunkIndex + 1 <= this.chunksCount;
  }

  private setupXHR(xhr: XMLHttpRequest): void {
    // reset response
    this.responseStatus = null;
    this.response = null;
    this.statusType = null;

    this._xhr_ = xhr;

    xhr.responseType = 'json';
    xhr.withCredentials = this.options.withCredentials;
    Object.keys(this.headers).forEach(key => xhr.setRequestHeader(key, this.headers[key]));

    // tslint:disable-next-line: no-unused-expression
    this._token && xhr.setRequestHeader('Authorization', `Bearer ${this._token}`);
  }

  private calculateChunksSize(chunksCount: number): void {
    this.chunkSize = Math.floor(this.size / chunksCount);
  }

  private isIndexChunkingWithNoRest(): boolean {
    return this.useChunksIndexes && this.size === this.chunkSize * this.chunksCount
  }
}
