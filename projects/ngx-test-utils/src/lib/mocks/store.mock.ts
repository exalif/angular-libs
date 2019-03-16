import { Observable, BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators';

export class MockStore<T> extends BehaviorSubject<T> {
  constructor(private _initialState: T) {
    super(_initialState);
  }

  public dispatch = jest.fn();

  public select = <R>(pathOrMapFn: any, ...paths: string[]): Observable<R> => {
    return map.call(this, pathOrMapFn);
  }
}
