import { TestBed, inject } from '@angular/core/testing';
import { LocalStorage } from './localstorage';
import { AlternativeStorage } from './alternativestorage';

const mockLocalStorage: { [key: string]: any } = {};

describe('core/LocalStorage', () => {
  describe('with no localStorage available', () => {
    beforeEach(() => {
      TestBed.configureTestingModule(testBedConfiguration());
      initSpyOnLocalStorage(true);
    });

    it('should use AlternativeStorage when no localStorage1', inject(
      [LocalStorage],
      (service: LocalStorage) => {
        expect(service._wrapped() instanceof AlternativeStorage).toBeTruthy();
      }
    ));

    it('setItem() and getItem() should works properly', inject(
      [LocalStorage],
      (service: LocalStorage) => {
        expect(service.getItem('key')).toBeNull();
        service.setItem('key', 'value');
        expect(service.getItem('key')).toBe('value');
      }
    ));

    it('remove() must remove item', inject(
      [LocalStorage],
      (service: LocalStorage) => {
        service.setItem('key', 'value');
        service.removeItem('key');
        expect(service.getItem('key')).toBeNull();
      }
    ));
  });

  describe('with localStorage available', () => {
    beforeEach(() => {
      TestBed.configureTestingModule(testBedConfiguration());
      initSpyOnLocalStorage(false);
    });

    it('should use localStorage if exists', inject(
      [LocalStorage],
      (service: LocalStorage) => {
        expect(service._wrapped() instanceof AlternativeStorage).toBeFalsy();
      }
    ));

    it('setItem() and getItem() should works properly', inject(
      [LocalStorage],
      (service: LocalStorage) => {
        expect(service.getItem('key')).toBeNull();
        service.setItem('key', 'value');
        expect(service.getItem('key')).toBe('value');
      }
    ));

    it('remove() must remove item', inject(
      [LocalStorage],
      (service: LocalStorage) => {
        service.setItem('key', 'value');
        service.removeItem('key');
        expect(service.getItem('key')).toBeNull();
      }
    ));
  });
});

const testBedConfiguration = () => ({ providers: [LocalStorage] });

const initSpyOnLocalStorage = (fakeNoLocalStorage: boolean) => {
  jest.spyOn(localStorage, 'setItem');
  jest.spyOn(localStorage, 'getItem');
  jest.spyOn(localStorage, 'removeItem');

  localStorage.getItem = jest.fn();
  localStorage.setItem = jest.fn();
  localStorage.removeItem = jest.fn();

  (localStorage.getItem as jest.Mock).mockImplementation(
    (key: string): string => {
      return mockLocalStorage[key] || null;
    }
  );

  (localStorage.removeItem as jest.Mock).mockImplementation(
    (key: string): void => {
      delete mockLocalStorage[key];
    }
  );

  (localStorage.setItem as jest.Mock).mockImplementation(
    (key: string, value: string): string => {
      if (fakeNoLocalStorage) {
        throw new Error('QuotaExceededError');
      } else {
        return (mockLocalStorage[key] = value as string);
      }
    }
  );
};
