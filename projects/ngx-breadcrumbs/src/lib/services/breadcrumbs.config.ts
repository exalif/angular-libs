import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Breadcrumb } from '../models/breadcrumb';

export type PostProcessFunction =
  (crumbs: Breadcrumb[]) => Promise<Breadcrumb[]> | Observable<Breadcrumb[]> | Breadcrumb[];

export type DistinctKey = keyof Breadcrumb;

@Injectable()
export class BreadcrumbsConfig {
  public postProcess: PostProcessFunction | null = null;
  public applyDistinctOn: DistinctKey | null = 'text';

  constructor(options: Partial<BreadcrumbsConfig> = {
    postProcess: null,
    applyDistinctOn: 'text',
  }) {
    if (!options) {
      return;
    }

    Object.keys(options).forEach((optionKey) => {
      this[optionKey] = options[optionKey];
    });
  }
}
