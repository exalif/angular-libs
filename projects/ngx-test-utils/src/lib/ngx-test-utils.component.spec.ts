import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTestUtilsComponent } from './ngx-test-utils.component';

describe('NgxTestUtilsComponent', () => {
  let component: NgxTestUtilsComponent;
  let fixture: ComponentFixture<NgxTestUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxTestUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTestUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
