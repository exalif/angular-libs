export function unfunc<T>(value: T | ((file: File) => T), file?: File): T {
  return value instanceof Function ? value(file) : value;
}
