import { TestBed } from '@angular/core/testing';

import { NgxSignaturePadService } from './ngx-signature-pad.service';

describe('NgxSignaturePadService', () => {
  let service: NgxSignaturePadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSignaturePadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
