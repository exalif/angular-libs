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

import { NgxFileUploadService } from './ngx-file-upload.service';
import { NgxFileUploadOptions } from './models/upload-options';
import { NgxFileUploadControlEvent } from './models/control-event';
import { NgxFileUploadState } from './models/upload-state';

@Directive({
  selector: '[ngxFileUpload]'
})
export class NgxFileUploadDirective implements OnInit, OnDestroy {
  @Input()
  public ngxFileUpload: NgxFileUploadOptions;

  @Input()
  set fileUploadAction(ctrlEvent: NgxFileUploadControlEvent) {
    if (ctrlEvent && this.uploadService) {
      this.uploadService.control(ctrlEvent);
    }
  }

  @Output()
  public fileUploadState: EventEmitter<Observable<NgxFileUploadState>> = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uploadService: NgxFileUploadService
  ) { }

  public listenerFn: () => void;

  public ngOnInit(): void {
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

    this.fileUploadState.emit(this.uploadService.events);
    this.listenerFn = this.renderer.listen(
      this.elementRef.nativeElement,
      'change',
      this.fileListener
    );
  }

  public fileListener = (): void => {
    if (this.elementRef.nativeElement.files) {
      this.uploadService.handleFileList(this.elementRef.nativeElement.files);
    }
  }

  public ngOnDestroy(): void {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }
}
