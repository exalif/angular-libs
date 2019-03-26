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
import { UploadxOptions } from './models/upload-options';
import { UploadxControlEvent } from './models/control-event';
import { UploadState } from './models/upload-state';

@Directive({
  selector: '[ngxfileupload]'
})
export class NgxFileUploadDirective implements OnInit, OnDestroy {
  @Input()
  public ngxfileupload: UploadxOptions;

  @Input()
  set uploadAction(ctrlEvent: UploadxControlEvent) {
    if (ctrlEvent && this.uploadService) {
      this.uploadService.control(ctrlEvent);
    }
  }

  @Output()
  public uploadState: EventEmitter<Observable<UploadState>> = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uploadService: NgxFileUploadService
  ) { }

  public listenerFn: () => void;

  public ngOnInit(): void {
    if (this.ngxfileupload) {
      if (this.ngxfileupload.allowedTypes) {
        this.renderer.setAttribute(
          this.elementRef.nativeElement,
          'accept',
          this.ngxfileupload.allowedTypes
        );
      }

      this.uploadService.init(this.ngxfileupload);
    }

    this.uploadState.emit(this.uploadService.eventsStream.asObservable());

    this.listenerFn = this.renderer.listen(
      this.elementRef.nativeElement,
      'change',
      this.fileListener
    );
  }

  public ngOnDestroy(): void {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  public fileListener(): void {
    if (this.elementRef.nativeElement.files) {
      this.uploadService.handleFileList(this.elementRef.nativeElement.files);
    }
  }
}
