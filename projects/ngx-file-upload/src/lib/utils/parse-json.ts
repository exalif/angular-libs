export function parseJson(xhr: XMLHttpRequest): any {
  return typeof xhr.response === 'object' || xhr.response === true
    ? xhr.response
    : JSON.parse(xhr.responseText || null);
}
