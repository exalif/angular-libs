import { UploadAction } from './upload-action';
import { UploadItem } from './upload-item';

export interface UploadxControlEvent {
  token?: string | (() => string);
  action: UploadAction;

  /**
   * override global options
   */
  itemOptions?: UploadItem;

  /** Upload unique identifier */
  uploadId?: string;
}
