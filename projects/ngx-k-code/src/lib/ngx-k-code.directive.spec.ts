import { TestBed, ComponentFixture, getTestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NgxKCodeDirective } from './ngx-k-code.directive';

const upArrow = new (window as any).KeyboardEvent('keydown', { keyCode: 38 });
const downArrow = new (window as any).KeyboardEvent('keydown', { keyCode: 40 });
const leftArrow = new (window as any).KeyboardEvent('keydown', { keyCode: 37 });
const rightArrow = new (window as any).KeyboardEvent('keydown', { keyCode: 39 });
const bKey = new (window as any).KeyboardEvent('keydown', { keyCode: 66 });
const aKey = new (window as any).KeyboardEvent('keydown', { keyCode: 65 });

@Component({
  template: `<div class="some-div" ngx-k-code></div>`
})
class TestComponent { }

describe('ngx-k-code directive ', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: NgxKCodeDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, NgxKCodeDirective]
    });

    fixture = TestBed.createComponent(TestComponent);

    component = fixture.componentInstance;
    directive = fixture.debugElement.query(By.directive(NgxKCodeDirective)).injector.get(NgxKCodeDirective);
  });

  beforeEach(() => {
    directive['sequence'] = [];
    fixture.detectChanges();
  });

  describe('when proper sequence is entered', () => {
    it('should trigger konami event', () => {
      const spy = jest.fn();
      directive.kCode.subscribe(spy);

      document.dispatchEvent(upArrow);
      document.dispatchEvent(upArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(leftArrow);
      document.dispatchEvent(rightArrow);
      document.dispatchEvent(leftArrow);
      document.dispatchEvent(rightArrow);
      document.dispatchEvent(bKey);
      document.dispatchEvent(aKey);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when improper sequence is entered', () => {
    it('should NOT trigger konami event', () => {
      const spy = jest.fn();
      directive.kCode.subscribe(spy);

      document.dispatchEvent(upArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(leftArrow);
      document.dispatchEvent(rightArrow);
      document.dispatchEvent(leftArrow);
      document.dispatchEvent(rightArrow);
      document.dispatchEvent(bKey);
      document.dispatchEvent(aKey);

      expect(spy).not.toHaveBeenCalled();
      expect(directive['sequence']).toEqual(['38', '40', '40', '40', '37', '39', '37', '39', '66', '65']);
    });
  });

  describe('when entering a too long sequence', () => {
    it('should change sequence by removing first key', () => {
      const spy = jest.fn();
      directive.kCode.subscribe(spy);

      document.dispatchEvent(upArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(downArrow);
      document.dispatchEvent(leftArrow);
      document.dispatchEvent(rightArrow);
      document.dispatchEvent(leftArrow);
      document.dispatchEvent(rightArrow);
      document.dispatchEvent(bKey);
      document.dispatchEvent(aKey);

      expect(spy).not.toHaveBeenCalled();
      expect(directive['sequence']).toEqual(['40', '40', '40', '40', '37', '39', '37', '39', '66', '65']);
    });
  });
});
