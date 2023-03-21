import { Observable, of, from } from 'rxjs';

export abstract class BreadcrumbsUtils {
  public static stringFormat(rawTemplate: string, data: any): string {
    const templateRegex = new RegExp('{{[\\s]*[a-zA-Z._]+?[\\s]*}}', 'g');

    return rawTemplate.replace(templateRegex, (match) => {
      const keyRegex = new RegExp('([a-zA-Z._]+)', 'g');
      const key = match.match(keyRegex);

      if (!key || !key.length) {
        return match;
      }

      const value = BreadcrumbsUtils.leaf(data, key[0]);

      if (!value) {
        return key[0];
      }

      return value;
    });
  }

  public static wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
    if (value instanceof Observable) {
      return value;
    }

    if (this.isPromise(value)) {
      return from(Promise.resolve(value));
    }

    return of(value as T);
  }

  private static isPromise(value: any): boolean {
    return value && (typeof value.then === 'function');
  }

  /**
   * Access object nested value by giving a path
   *
   * @param obj The object you want to access value from
   * @param path The value path. e.g: `bar.baz`
   * @example
   *   const obj = { foo: { bar: 'Baz' } };
   *   const path = 'foo.bar';
   *   leaf(obj, path) // 'Baz'
   */
  public static leaf(obj: any, path: string) {
    const result = path.split('.').reduce((value, el) => value[el] || {}, obj);

    return BreadcrumbsUtils.isEmptyObject(result) ? null : result;
  };

  /**
   * checks whether an object is empty or not
   *
   * @param object object to extract values from
   * @returns boolean
   */
  public static isEmptyObject(obj): boolean {
    if (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }

      return true;
    }

    return false;
  }
}
