/**
 * Global Options
 */
export class NgxFileUploadOptions {
  /**
   *  Set "accept" attribute
   *
   * @example
   * allowedTypes: 'image/*, video/*'
   */
  allowedTypes?: string;

  /**
   * Auto upload with global options
   *
   * @defaultValue true
   */
  autoUpload?: boolean;

  /**
   * If set use chunks for upload
   *
   * @defaultValue 0
   */
  chunkSize?: number;

  /**
   * Uploads in parallel
   *
   * @defaultValue 2
   */
  concurrency?: number;

  /**
   * Custom headers
   */
  headers?: { [key: string]: string } | ((file?: File) => { [key: string]: string });

  /**
   * Upload API initial method
   *
   * @defaultValue 'POST'
   */
  method?: string;

  /**
   * Upload meta
   *
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
   *
   * @defaultValue '/upload/'
   */
  endpoint?: string;

  /**
   * Upload API URL
   *
   * @defaultValue '/upload/'
   * @deprecated Use {@link NgxFileUploadOptions.endpoint} instead.
   */
  url?: string;

  /**
   * Use withCredentials xhr option?
   *
   * @defaultValue false
   */
  withCredentials?: boolean;

  /**
   * Max status >= 4xx retries
   * If set to 0, triggers unlimited retries
   *
   * @defaultValue 3
   */
  maxRetryAttempts?: number;

  /**
   * Use data from "create" POST response body to determine uploadId and chunksCount instead of looking into headers
   *
   * @defaultValue false
   */
  useDataFromPostResponseBody?: boolean;

  /**
   * Use backend provided upload id. If set to false, the frontend will generate the upload id
   *
   * @defaultValue false
   */
  useBackendUploadId?: boolean;

  /**
   * Key name for backend provided upload id. Used only if useBackendUploadId option is enabled
   *
   * @defaultValue 'uploadId'
   */
  backendUploadIdName?: string;

  /**
   * Append upload id to endpoint to get the upload endpoint path
   * e.g. with `uploadId = 'someid'` the upload endpoint will become `endpoint/someId`
   *
   * @defaultValue false
   */
  useUploadIdAsUrlPath?: boolean;

  /**
   * Send file using formData instead of raw body.
   * Setting this to false will send an application/octet-stream Content-Type Header
   *
   * @defaultValue false
   */
  useFormData?: boolean;

  /**
   * The name of the file's FormData key
   *
   * @defaultValue `file`
   */
  formDataFileKey?: string;

  /**
   * A backend error codes array
   * if an error code matching an array element occurs, it will not retry and set an error state
   *
   * @defaultValue []
   */
  breakRetryErrorCodes?: number[];

  /**
   * Checksum Hash method
   */
  checksumHashMethod?: (file: File) => Promise<string>;
}
