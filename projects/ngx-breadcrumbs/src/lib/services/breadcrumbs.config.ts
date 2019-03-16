import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Breadcrumb } from '../models/breadcrumb';

export type PostProcessFunction =
  (crumbs: Breadcrumb[]) => Promise<Breadcrumb[]> | Observable<Breadcrumb[]> | Breadcrumb[];

@Injectable()
export class BreadcrumbsConfig {
  postProcess: PostProcessFunction;
}
