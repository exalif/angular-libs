import { parseJson } from './parse-json';

export function getKeyFromResponse(xhr: XMLHttpRequest, key: string): string {
  const fromHeader = xhr.getResponseHeader(key);

  if (fromHeader) {
    return fromHeader;
  }

  const response = parseJson(xhr) || {};
  const resKey = Object.keys(response).find(k => k.toLowerCase() === key.toLowerCase());

  return response[resKey];
}
