import { getKeyFromResponse } from './get-key-from-response';

const KEY = 'someKey';
const HEADER_VALUE = 'header value';
const VALID_KEY = 'validKey';
const ANOTHER_VALID_KEY = 'anothervalidkey';
const VALID_JSON_OBJECT = {
  validKey: VALID_KEY,
  anothervalidkey: ANOTHER_VALID_KEY
};

jest.mock('./parse-json', () => {
  return {
    parseJson: () => null
  };
});

describe('when parse json returns no valid value', () => {
  describe('get key from response', () => {
    let result: string;
    let xhr: any;

    beforeEach(() => {
      result = undefined;
    });

    describe('when key does not exists in headers', () => {
      beforeEach(() => {
        xhr = { getResponseHeader: jest.fn().mockReturnValue(undefined) } as any;
        result = getKeyFromResponse(xhr, KEY);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});

jest.unmock('./parse-json');
jest.mock('./parse-json', () => {
  return {
    parseJson: () => VALID_JSON_OBJECT
  };
});

describe('when parse json returns valid value', () => {
  describe('get key from response', () => {
    let result: string;
    let xhr: any;

    beforeEach(() => {
      result = undefined;
    });

    describe('when key exists in headers', () => {
      describe('when bypassHeaderCheck option is set to false', () => {
        beforeEach(() => {
          xhr = { getResponseHeader: jest.fn().mockReturnValue(HEADER_VALUE) } as any;

          result = getKeyFromResponse(xhr, KEY);
        });

        it('should retrieve key from header', () => {
          expect(xhr.getResponseHeader).toHaveBeenCalledWith(KEY);
          expect(result).toEqual(HEADER_VALUE);
        });
      });

      describe('when bypassHeaderCheck option is set to true', () => {
        beforeEach(() => {
          xhr = { getResponseHeader: jest.fn().mockReturnValue(HEADER_VALUE) } as any;

          result = getKeyFromResponse(xhr, KEY, true);
        });

        it('should NOT retrieve key from header', () => {
          expect(xhr.getResponseHeader).not.toHaveBeenCalledWith(KEY);
          expect(result).not.toEqual(HEADER_VALUE);
        });
      });
    });

    describe('when key does not exists in headers', () => {
      beforeEach(() => {
        xhr = { getResponseHeader: jest.fn().mockReturnValue(undefined) } as any;
      });


      describe('when key with uppercase is found in json', () => {
        beforeEach(() => {
          result = getKeyFromResponse(xhr, VALID_KEY);
        });

        it('should return key value', () => {
          expect(result).toEqual(VALID_KEY);
        });
      });

      describe('when a key without uppercase is found in json', () => {
        beforeEach(() => {
          result = getKeyFromResponse(xhr, ANOTHER_VALID_KEY);
        });

        it('should return key value', () => {
          expect(result).toEqual(ANOTHER_VALID_KEY);
        });
      });
    });
  });
});
