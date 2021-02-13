import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { Observable, of, BehaviorSubject, concat } from 'rxjs';

import { filter, flatMap, distinct, toArray, first, tap } from 'rxjs/operators';

import { BreadcrumbsConfig } from './breadcrumbs.config';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';
import { Breadcrumb } from '../models/breadcrumb';
import { BreadcrumbsUtils } from '../utils/breadcrumbs.utils';

@Injectable()
export class BreadcrumbsService {

  private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  private defaultResolver = new BreadcrumbsResolver();

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private config: BreadcrumbsConfig,
    private injector: Injector
  ) {

    this.router.events.pipe(filter((x) => x instanceof NavigationEnd))
      .subscribe((_: NavigationEnd) => {
        const routeRoot = router.routerState.snapshot.root;

        this.resolveCrumbs(routeRoot).pipe(
          flatMap((crumbs: Breadcrumb[]) => crumbs),
          this.config.applyDistinctOn
            ? distinct((crumb: Breadcrumb) => crumb[this.config.applyDistinctOn])
            : tap(),
          toArray(),
          flatMap((crumbs: Breadcrumb[]) => {
            if (this.config.postProcess) {
              const postProcessedCrumb = this.config.postProcess(crumbs);
              return BreadcrumbsUtils.wrapIntoObservable<Breadcrumb[]>(postProcessedCrumb).pipe(
                first()
              );
            } else {
              return of(crumbs);
            }
          })
        )
          .subscribe((crumbs: Breadcrumb[]) => {
            this.breadcrumbs.next(crumbs);
          });
      });
  }

  get crumbs$(): Observable<Breadcrumb[]> {
    return this.breadcrumbs;
  }

  public getCrumbs(): Observable<Breadcrumb[]> {
    return this.crumbs$;
  }

  private resolveCrumbs(route: ActivatedRouteSnapshot)
    : Observable<Breadcrumb[]> {

    let crumbs$: Observable<Breadcrumb[]>;

    const data = route.routeConfig && route.routeConfig.data;

    if (data && data.breadcrumbs) {
      let resolver: BreadcrumbsResolver;

      if (data.breadcrumbs.prototype instanceof BreadcrumbsResolver) {
        resolver = this.injector.get(data.breadcrumbs);
      } else {
        resolver = this.defaultResolver;
      }

      const result = resolver.resolve(route, this.router.routerState.snapshot);
      crumbs$ = BreadcrumbsUtils.wrapIntoObservable<Breadcrumb[]>(result).pipe(
        first()
      );

    } else {
      crumbs$ = of([]);
    }

    if (route.firstChild) {
      crumbs$ = concat(crumbs$, this.resolveCrumbs(route.firstChild));
    }

    return crumbs$;
  }
}
