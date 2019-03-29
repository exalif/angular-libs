import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Observable } from 'rxjs';

import { ServiceWayComponent } from './service-way.component';
import { NgxFileUploadService } from '../../../../ngx-file-upload/src/lib/ngx-file-upload.service';

describe('ServiceWayComponent', () => {
  let comp: ServiceWayComponent;
  let fixture: ComponentFixture<ServiceWayComponent>;

  beforeEach(() => {
    const observableStub = {};
    const uploadServiceStub = {
      init: () => ({}),
      control: () => ({})
    };
    TestBed.configureTestingModule({
      declarations: [ServiceWayComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Observable, useValue: observableStub },
        { provide: NgxFileUploadService, useValue: uploadServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ServiceWayComponent);
    comp = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(comp).toBeTruthy();
  });

  describe('cancelAll', () => {
    it('makes expected calls', () => {
      const uploadServiceStub: NgxFileUploadService = fixture.debugElement.injector.get(NgxFileUploadService);
      spyOn(uploadServiceStub, 'control');
      comp.cancelAll();
      expect(uploadServiceStub.control).toHaveBeenCalled();
    });
  });

  describe('uploadAll', () => {
    it('makes expected calls', () => {
      const uploadServiceStub: NgxFileUploadService = fixture.debugElement.injector.get(NgxFileUploadService);
      spyOn(uploadServiceStub, 'control');
      comp.uploadAll();
      expect(uploadServiceStub.control).toHaveBeenCalled();
    });
  });

  describe('pauseAll', () => {
    it('makes expected calls', () => {
      const uploadServiceStub: NgxFileUploadService = fixture.debugElement.injector.get(NgxFileUploadService);
      spyOn(uploadServiceStub, 'control');
      comp.pauseAll();
      expect(uploadServiceStub.control).toHaveBeenCalled();
    });
  });
});
