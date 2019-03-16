export const assertTranslateWithParams = (
  textContent: string,
  translationString: string,
  params: {}
): void => {
  expect(textContent).toContain(`translated ${translationString} ${JSON.stringify(params)}`);
};
