export const parseJson = (xhr: XMLHttpRequest): any => typeof xhr.response === 'object' || xhr.response === true
  ? xhr.response
  : JSON.parse(xhr.responseText || null);
