import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterState } from '@angular/router';

import { Observable, of, BehaviorSubject, Subscription, concat } from 'rxjs';

import { filter, flatMap, distinct, toArray, first } from 'rxjs/operators';

import { BreadcrumbsConfig } from './breadcrumbs.config';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';
import { Breadcrumb } from '../models/breadcrumb';
import { BreadcrumbsUtils } from '../utils/breadcrumbs.utils';

@Injectable()
export class BreadcrumbsService {

  private _breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  private _defaultResolver = new BreadcrumbsResolver();

  constructor(
    private _router: Router,
    public route: ActivatedRoute,
    private _config: BreadcrumbsConfig,
    private _injector: Injector
  ) {

    this._router.events.pipe(filter((x) => x instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const routeRoot = _router.routerState.snapshot.root;

        this._resolveCrumbs(routeRoot).pipe(
          flatMap((crumbs: Breadcrumb[]) => crumbs),
          distinct((crumb: Breadcrumb) => crumb.text),
          toArray(),
          flatMap((crumbs: Breadcrumb[]) => {
            if (this._config.postProcess) {
              const postProcessedCrumb = this._config.postProcess(crumbs);
              return BreadcrumbsUtils.wrapIntoObservable<Breadcrumb[]>(postProcessedCrumb).pipe(
                first()
              );
            } else {
              return of(crumbs);
            }
          })
        )
          .subscribe((crumbs: Breadcrumb[]) => {
            this._breadcrumbs.next(crumbs);
          });
      });
  }

  get crumbs$(): Observable<Breadcrumb[]> {
    return this._breadcrumbs;
  }

  public getCrumbs(): Observable<Breadcrumb[]> {
    return this.crumbs$;
  }

  private _resolveCrumbs(route: ActivatedRouteSnapshot)
    : Observable<Breadcrumb[]> {

    let crumbs$: Observable<Breadcrumb[]>;

    const data = route.routeConfig && route.routeConfig.data;

    if (data && data.breadcrumbs) {
      let resolver: BreadcrumbsResolver;

      if (data.breadcrumbs.prototype instanceof BreadcrumbsResolver) {
        resolver = this._injector.get(data.breadcrumbs);
      } else {
        resolver = this._defaultResolver;
      }

      const result = resolver.resolve(route, this._router.routerState.snapshot);
      crumbs$ = BreadcrumbsUtils.wrapIntoObservable<Breadcrumb[]>(result).pipe(
        first()
      );

    } else {
      crumbs$ = of([]);
    }

    if (route.firstChild) {
      crumbs$ = concat(crumbs$, this._resolveCrumbs(route.firstChild));
    }

    return crumbs$;
  }
}
