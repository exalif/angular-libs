import { Options as SignatureOptions } from 'signature_pad';

export type NgxSignaturePadOptions = SignatureOptions & {
  canvasHeight?: number;
  canvasWidth?: number;
  canvasId?: string;
  canvasClass?: string;
};
