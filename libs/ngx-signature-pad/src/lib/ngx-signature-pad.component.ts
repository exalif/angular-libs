import {
  Component,
  AfterContentInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';

import SignaturePad, { PointGroup } from 'signature_pad';

import { NgxSignaturePadOptions } from './models/signature-pad-options';

@Component({
  template: '<canvas #signatureCanvas></canvas>',
  selector: 'ngx-signature-pad',
})
export class NgxSignaturePadComponent implements AfterContentInit, OnDestroy {
  @Input() public options: NgxSignaturePadOptions;

  @ViewChild('signatureCanvas', { static: false }) public canvas: ElementRef<HTMLCanvasElement>;

  @Output() public begin: EventEmitter<boolean> = new EventEmitter();

  /* eslint-disable-next-line @angular-eslint/no-output-native */
  @Output() public end: EventEmitter<boolean> = new EventEmitter();

  private signaturePad: SignaturePad;

  constructor() {
    this.options = this.options || {};
  }

  public ngAfterContentInit(): void {
    if (this.options.canvasHeight) {
      this.canvas.nativeElement.height = this.options.canvasHeight;
    }

    if (this.options.canvasWidth) {
      this.canvas.nativeElement.width = this.options.canvasWidth;
    }

    if (this.options.canvasId) {
      this.canvas.nativeElement.id = this.options.canvasId;
    }

    if (this.options.canvasClass) {
      this.canvas.nativeElement.classList.add(this.options.canvasClass);
    }

    this.signaturePad = new SignaturePad(this.canvas.nativeElement, this.options);
    this.signaturePad.addEventListener('beginStroke', () => {
      this.onBegin();
    }, { once: true });

    this.signaturePad.addEventListener('endStroke', () => {
      this.onEnd();
    }, { once: true });
  }

  public ngOnDestroy(): void {
    this.canvas.nativeElement.width = 0;
    this.canvas.nativeElement.height = 0;
  }

  public resizeCanvas(): void {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    const ratio: number = Math.max(window.devicePixelRatio || 1, 1);
    const signaturePadCanvas: HTMLCanvasElement = this.signaturePad['canvas'];

    signaturePadCanvas.width = signaturePadCanvas.offsetWidth * ratio;
    signaturePadCanvas.height = signaturePadCanvas.offsetHeight * ratio;
    signaturePadCanvas.getContext('2d').scale(ratio, ratio);

    // otherwise isEmpty() might return incorrect value
    this.signaturePad.clear();
  }

  // Returns signature image as an array of point groups
  public toData(): PointGroup[] {
    if (this.signaturePad) {
      return this.signaturePad.toData();
    } else {
      return [];
    }
  }

  // Draws signature image from an array of point groups
  public fromData(points: PointGroup[]): void {
    this.signaturePad.fromData(points);
  }

  // Returns signature image as data URL
  // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
  // for the list of possible paramters
  public toDataURL(imageType?: string, quality?: number): string {
    // save image as data URL
    return this.signaturePad.toDataURL(imageType, quality);
  }

  // Draws signature image from data URL
  public fromDataURL(dataURL: string, options: any = {}): void {
    // set default height and width on read data from URL
    if (!Object.prototype.hasOwnProperty.call(options, 'height') && this.options.canvasHeight) {
      options.height = this.options.canvasHeight;
    }

    if (!Object.prototype.hasOwnProperty.call(options, 'width') && this.options.canvasWidth) {
      options.width = this.options.canvasWidth;
    }

    this.signaturePad.fromDataURL(dataURL, options);
  }

  // Clears the canvas
  public clear(): void {
    this.signaturePad.clear();
  }

  public isEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }

  // Unbinds all event handlers
  public off(): void {
    this.signaturePad.off();
  }

  // Rebinds all event handlers
  public on(): void {
    this.signaturePad.on();
  }

  // set an option on the signaturePad - e.g. set('minWidth', 50);
  public set(option: string, value: any): void {
    switch (option) {
      case 'canvasHeight':
        this.signaturePad['canvas'].height = value;
        break;
      case 'canvasWidth':
        this.signaturePad['canvas'].width = value;
        break;
      case 'canvasId':
        this.signaturePad['canvas'].id = value;
        break;
      case 'canvasClass':
        this.signaturePad['canvas'].class = value;
        break;
      default:
        this.signaturePad[option] = value;
    }
  }

  public onBegin(): void {
    this.begin.emit(true);
  }

  public onEnd(): void {
    this.end.emit(true);
  }

  public queryPad(): SignaturePad {
    return this.signaturePad;
  }
}
