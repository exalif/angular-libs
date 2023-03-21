export const unfunc = <T>(value: T | ((file: File) => T), file?: File) =>
  value instanceof Function ? value(file) : value;
