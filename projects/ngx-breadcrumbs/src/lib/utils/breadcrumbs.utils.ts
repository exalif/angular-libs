import { Observable, of, from } from 'rxjs';

import * as template from 'lodash.template';
import * as templateSettings from 'lodash.templatesettings';

const _ = {
  template: template,
  templateSettings: templateSettings
};
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export abstract class BreadcrumbsUtils {
  public static stringFormat(rawTemplate: string, binding: any): string {
    const compiled = _.template(rawTemplate);

    return compiled(binding);
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
}
