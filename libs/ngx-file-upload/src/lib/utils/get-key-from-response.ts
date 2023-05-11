import { parseJson } from './parse-json';

export const getKeyFromResponse = (xhr: XMLHttpRequest, key: string, bypassHeaderCheck = false): string => {
  if (!bypassHeaderCheck) {
    const fromHeader = xhr.getResponseHeader(key);

    if (fromHeader) {
      return fromHeader;
    }
  }

  const response = parseJson(xhr) || {};
  const resKey = Object.keys(response).find(k => k.toLowerCase() === key.toLowerCase());

  return response[resKey];
};
