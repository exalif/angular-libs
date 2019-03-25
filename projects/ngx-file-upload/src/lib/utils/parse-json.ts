export function parseJson(xhr: XMLHttpRequest) {
  return typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.responseText || null);
}
