import { TestBed } from '@angular/core/testing';

import { NgxTestUtilsService } from './ngx-test-utils.service';

describe('NgxTestUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxTestUtilsService = TestBed.get(NgxTestUtilsService);
    expect(service).toBeTruthy();
  });
});
