import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Observable } from 'rxjs';


import { ServiceCodeWayComponent } from './service-code-way.component';
import { NgxFileUploadService } from '../../../../ngx-file-upload/src/lib/ngx-file-upload.service';

describe('ServiceCodeWayComponent', () => {
  let comp: ServiceCodeWayComponent;
  let fixture: ComponentFixture<ServiceCodeWayComponent>;
  let uploadService: NgxFileUploadService;

  beforeEach(() => {
    const observableStub = {};
    const uploadServiceStub = {
      init: jasmine.createSpy('init'),
      control: jasmine.createSpy('control'),
      handleFile: jasmine.createSpy('handleFile')
    };
    TestBed.configureTestingModule({
      declarations: [ServiceCodeWayComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Observable, useValue: observableStub },
        { provide: NgxFileUploadService, useValue: uploadServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ServiceCodeWayComponent);
    uploadService = TestBed.get(NgxFileUploadService);
    comp = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(comp).toBeTruthy();
  });

  describe('cancelAll', () => {
    it('makes expected calls', () => {
      comp.cancelAll();
      expect(uploadService.control).toHaveBeenCalled();
    });
  });

  describe('uploadAll', () => {
    it('makes expected calls', () => {
      comp.uploadAll();
      expect(uploadService.control).toHaveBeenCalled();
    });
  });

  describe('pauseAll', () => {
    it('makes expected calls', () => {
      comp.pauseAll();
      expect(uploadService.control).toHaveBeenCalled();
    });
  });
});
