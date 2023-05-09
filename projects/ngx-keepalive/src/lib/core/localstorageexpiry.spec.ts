import { TestBed, inject } from '@angular/core/testing';
import { LocalStorageExpiry } from './localstorageexpiry';
import { LocalStorage } from './localstorage';

const mockLocalStorage: { [key: string]: any } = {};

describe('core/LocalStorageExpiry', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(testBedConfiguration());
    initSpyOnLocalStorage();
  });

  it('last() returns the current value', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      expect(service.last()).toBeNull();
    }
  ));

  it('last() sets the specified value', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      const expected = new Date();
      expect(service.last(expected)).toEqual(expected);
      expect(service.last()).toEqual(expected);
    }
  ));

  it('last() remove value and return null if param is null', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      const expected = null;
      expect(service.last(expected as any)).toEqual(expected);
      expect(service.last()).toEqual(expected);
    }
  ));

  it('idling() returns the current value', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      expect(service.idling()).toBeFalsy();
    }
  ));

  it('idling() sets the specified value', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      const expected = true;
      expect(service.idling(expected)).toEqual(expected);
      expect(service.idling()).toEqual(expected);
    }
  ));

  it('idling() with null param return false', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      const expected = false;
      expect(service.idling(null as any)).toEqual(expected);
      expect(service.idling()).toEqual(expected);
    }
  ));

  it('last() return false if param is null', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      const expected = false;
      expect(service.idling(null as any)).toEqual(expected);
      expect(service.idling()).toEqual(expected);
    }
  ));

  it('setIdleName() sets the key name of expiry', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      expect(service.getIdleName()).toBe('main');
      service.setIdleName('demo');
      expect(service.getIdleName()).toBe('demo');
    }
  ));

  it('setIdleName() doesn\'t set expiry key name if param is null', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      expect(service.getIdleName()).toBe('main');
      service.setIdleName(null as any);
      expect(service.getIdleName()).toBe('main');
    }
  ));

  it('setIdleName() doesn\'t set expiry key name if param is empty', inject(
    [LocalStorageExpiry],
    (service: LocalStorageExpiry) => {
      expect(service.getIdleName()).toBe('main');
      service.setIdleName('');
      expect(service.getIdleName()).toBe('main');
    }
  ));
});

const testBedConfiguration = () => {
  return {
    providers: [LocalStorage, LocalStorageExpiry]
  };
};

const initSpyOnLocalStorage = () => {
  spyOn(localStorage, 'getItem').and.callFake(
    (key: string): string => {
      return mockLocalStorage[key] || null;
    }
  );
  spyOn(localStorage, 'removeItem').and.callFake(
    (key: string): void => {
      delete mockLocalStorage[key];
    }
  );
  spyOn(localStorage, 'setItem').and.callFake(
    (key: string, value: string): string => {
      return (mockLocalStorage[key] = value as string);
    }
  );
};
