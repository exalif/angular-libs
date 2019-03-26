export interface NgxFileUploadItem {
  /**
   * Upload API initial method
   * @defaultValue 'POST'
   */
  method?: string;

  /**
   * Upload unique identifier
   */
  readonly uploadId?: string;

  /**
   * Upload API URL
   * @defaultValue '/upload/'
   */
  endpoint?: string;

  /**
   * Upload API URL
   * @defaultValue '/upload/'
   * @deprecated Use {@link NgxFileUploadItem.endpoint} instead.
   */
  url?: string;

  /**
   * Custom headers
   */
  headers?: { [key: string]: string } | ((file?: File) => { [key: string]: string });

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
}
