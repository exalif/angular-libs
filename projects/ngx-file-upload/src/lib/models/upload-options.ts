/**
 * Global Options
 */
export class NgxFileUploadOptions {
  /**
   *  Set "accept" attribute
   * @example
   * allowedTypes: 'image/*, video/*'
   */
  allowedTypes?: string;

  /**
   * Auto upload with global options
   * @defaultValue true
   */
  autoUpload?: boolean;

  /**
   * If set use chunks for upload
   * @defaultValue 0
   */
  chunkSize?: number;

  /**
   * Uploads in parallel
   * @defaultValue 2
   */
  concurrency?: number;

  /**
   * Custom headers
   */
  headers?: { [key: string]: string } | ((file?: File) => { [key: string]: string });

  /**
   * Upload API initial method
   * @defaultValue 'POST'
   */
  method?: string;

  /**
   * Upload meta
   * @defaultValue
   * { name: File.Filename, mimeType: File.type }
   */
  metadata?: { [key: string]: any } | ((file?: File) => { [key: string]: any });

  /**
   * Authorization Bearer token
   */
  token?: string | (() => string);

  /**
   * Upload API URL
   * @defaultValue '/upload/'
   */
  endpoint?: string;

  /**
   * Upload API URL
   * @defaultValue '/upload/'
   * @deprecated Use {@link NgxFileUploadOptions.endpoint} instead.
   */
  url?: string;

  /**
   * Use withCredentials xhr option?
   * @defaultValue false
   */
  withCredentials?: boolean;

  /**
   * Max status 4xx retries
   * @defaultValue 3
   */
  maxRetryAttempts?: number;

  /**
   * Checksum Hash method
   */
  checksumHashMethod?: (file: File) => Promise<string>
}
