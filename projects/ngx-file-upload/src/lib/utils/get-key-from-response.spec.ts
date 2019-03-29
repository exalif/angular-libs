import { getKeyFromResponse } from './get-key-from-response';

const KEY = 'someKey';
const HEADER_VALUE = 'header value';

describe('get key from response', () => {
  let result: string;
  let xhr: any;

  beforeEach(() => {
    result = undefined;
  });

  describe('when key exists in headers', () => {
    beforeEach(() => {
      xhr = { getResponseHeader: jest.fn().mockReturnValue(HEADER_VALUE) } as any;

      result = getKeyFromResponse(xhr, KEY);
    });

    it('should retrieve key from header', () => {
      expect(xhr.getResponseHeader).toHaveBeenCalledWith(KEY);
      expect(result).toEqual(HEADER_VALUE);
    });
  });
});
