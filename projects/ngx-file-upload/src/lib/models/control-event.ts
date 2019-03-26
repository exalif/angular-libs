import { NgxFileUploadItem } from './upload-item';
import { NgxFileUploadAction } from './upload-action';

export interface NgxFileUploadControlEvent {
  token?: string | (() => string);
  action: NgxFileUploadAction;

  /**
   * override global options
   */
  itemOptions?: NgxFileUploadItem;

  /** Upload unique identifier */
  uploadId?: string;
}
