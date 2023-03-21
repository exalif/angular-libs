import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, UrlSegment } from '@angular/router';

import { Observable, of } from 'rxjs';

import { Breadcrumb } from '../models/breadcrumb';
import { BreadcrumbsUtils } from '../utils/breadcrumbs.utils';

export class BreadcrumbsResolver implements Resolve<Breadcrumb[]> {
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Breadcrumb[]> | Promise<Breadcrumb[]> | Breadcrumb[] {

    const data = route.routeConfig.data;
    const path = this.getFullPath(route);

    let text = typeof (data.breadcrumbs) === 'string' ? data.breadcrumbs : data.breadcrumbs.text || data.text || path;
    text = BreadcrumbsUtils.stringFormat(text, route.data);

    const crumbs: Breadcrumb[] = [{
      text,
      path
    }];

    return of(crumbs);
  }

  public getFullPath(route: ActivatedRouteSnapshot): string {
    return this.fetchFullPath(route.pathFromRoot);
  }

  private fetchFullPath(routes: ActivatedRouteSnapshot[]): string {
    return routes.reduce((path, route) => path += this.fetchRelativePath(route.url), '');
  }

  private fetchRelativePath(urlSegments: UrlSegment[]): string {
    return urlSegments.reduce((path, urlSegment) => path += '/' + urlSegment.path, '');
  }
}
