import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Observable } from 'rxjs';

import { UploadxService } from './uploadx.service';
import { UploadxOptions } from './models/upload-options';
import { UploadxControlEvent } from './models/control-event';
import { UploadState } from './models/upload-state';

@Directive({
  selector: '[uploadx]'
})
export class UploadxDirective implements OnInit, OnDestroy {
  listenerFn: () => void;
  @Output()
  uploadxState = new EventEmitter();
  @Input()
  uploadx: UploadxOptions;
  @Input()
  set uploadxAction(ctrlEvent: UploadxControlEvent) {
    if (ctrlEvent && this.uploadService) {
      this.uploadService.control(ctrlEvent);
    }
  }
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uploadService: UploadxService
  ) {}

  ngOnInit() {
    if (this.uploadx) {
      if (this.uploadx.allowedTypes) {
        this.renderer.setAttribute(
          this.elementRef.nativeElement,
          'accept',
          this.uploadx.allowedTypes
        );
      }
      this.uploadService.init(this.uploadx);
    }
    this.uploadxState.emit(<Observable<UploadState>>this.uploadService.eventsStream.asObservable());
    this.listenerFn = this.renderer.listen(
      this.elementRef.nativeElement,
      'change',
      this.fileListener
    );
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  fileListener = () => {
    if (this.elementRef.nativeElement.files) {
      this.uploadService.handleFileList(this.elementRef.nativeElement.files);
    }
  };
}
