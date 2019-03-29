import { parseJson } from './parse-json';

const VALID_JSON = JSON.stringify({
  some: 'jsonValue'
});

const PARSED_JSON = JSON.parse(VALID_JSON);

const RESPONSE = {
  some: 'object'
};

const XHR_WITH_OBJECT_RESPONSE = {
  response: RESPONSE
};

const XHR_WITH_NULL_RESPONSE_NO_RESPONSETEXT = {
  response: null
};

const XHR_WITH_RESPONSETEXT = {
  responseText: VALID_JSON
};

describe('parse json', () => {
  describe('when xhr response is an object', () => {
    it('should return the response', () => {
      expect(parseJson(XHR_WITH_OBJECT_RESPONSE as any)).toEqual(RESPONSE);
    });
  });

  describe('when xhr response is not an object', () => {
    describe('when there is no responseText', () => {
      it('should return null', () => {
        expect(parseJson(XHR_WITH_NULL_RESPONSE_NO_RESPONSETEXT as any)).toBeNull();
      });
    });

    describe('when there is a JSON responseText', () => {
      it('should return parsed JSON', () => {
        expect(parseJson(XHR_WITH_RESPONSETEXT as any)).toEqual(PARSED_JSON);
      });
    });
  });
});
