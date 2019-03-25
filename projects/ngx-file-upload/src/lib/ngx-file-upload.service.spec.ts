import { TestBed } from '@angular/core/testing';

import { NgxFileUploadService } from './ngx-file-upload.service';

describe('NgxFileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxFileUploadService = TestBed.get(NgxFileUploadService);
    expect(service).toBeTruthy();
  });
});
