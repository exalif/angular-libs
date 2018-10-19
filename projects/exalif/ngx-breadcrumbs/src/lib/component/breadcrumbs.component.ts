
import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { BreadcrumbsService } from '../services/breadcrumbs.service';
import { Breadcrumb } from '../models/breadcrumb';

@Component({
  selector: 'lib-breadcrumbs',
  template: `
    <ol *ngIf="crumbs$ | async as crumbs" class="breadcrumbs__container">
      <li *ngFor="let crumb of crumbs; let last = last"
        [ngClass]="{ 'breadcrumbs__item--active': last }"
        class="breadcrumbs__item"
      >
        <a *ngIf="!last" [routerLink]="crumb.path">{{ crumb.text }}</a>
        <span *ngIf="last">{{ crumb.text }}</span>
      </li>
    </ol>
  `
})
export class BreadcrumbsComponent {
  public crumbs$: Observable<Breadcrumb[]> = this.breadcrumbsService.getCrumbs();

  constructor(public breadcrumbsService: BreadcrumbsService) { }
}
