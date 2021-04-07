import { Options } from 'signature_pad';

export type NgxSignaturePadOptions = Options & {
  canvasHeight?: number;
  canvasWidth?: number;
  canvasId?: string;
  canvasClass?: string;
};
