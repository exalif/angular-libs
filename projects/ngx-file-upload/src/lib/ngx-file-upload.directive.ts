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

import { UploadxService } from './ngx-file-upload.service';
import { NgxFileUploadOptions } from './models/upload-options';
import { NgxFileUploadControlEvent } from './models/control-event';
import { NgxFileUploadState } from './models/upload-state';

@Directive({
  selector: '[ngxFileUpload]'
})
export class NgxFileUploadDirective implements OnInit, OnDestroy {
  listenerFn: () => void;
  @Output()
  fileUploadState = new EventEmitter();
  @Input()
  ngxFileUpload: NgxFileUploadOptions;
  @Input()
  set fileUploadAction(ctrlEvent: NgxFileUploadControlEvent) {
    if (ctrlEvent && this.uploadService) {
      this.uploadService.control(ctrlEvent);
    }
  }
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uploadService: UploadxService
  ) { }

  ngOnInit() {
    if (this.ngxFileUpload) {
      if (this.ngxFileUpload.allowedTypes) {
        this.renderer.setAttribute(
          this.elementRef.nativeElement,
          'accept',
          this.ngxFileUpload.allowedTypes
        );
      }
      this.uploadService.init(this.ngxFileUpload);
    }
    this.fileUploadState.emit(<Observable<NgxFileUploadState>>this.uploadService.eventsStream.asObservable());
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
  }
}
