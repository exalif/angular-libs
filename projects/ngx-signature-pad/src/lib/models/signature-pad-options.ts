import { IOptions } from 'signature_pad';

export type NgxSignaturePadOptions = IOptions & {
  canvasHeight?: number;
  canvasWidth?: number;
  canvasId?: string;
  canvasClass?: string;
};
