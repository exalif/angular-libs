import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreadcrumbsConfig } from './services/breadcrumbs.config';
import { BreadcrumbsService } from './services/breadcrumbs.service';
import { BreadcrumbsComponent } from './component/breadcrumbs.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [BreadcrumbsComponent],
  exports: [BreadcrumbsComponent]
})
export class BreadcrumbsModule {
  public static forRoot(): ModuleWithProviders<BreadcrumbsModule> {
    return {
      ngModule: BreadcrumbsModule,
      providers: [
        BreadcrumbsConfig,
        BreadcrumbsService
      ]
    };
  }
}
