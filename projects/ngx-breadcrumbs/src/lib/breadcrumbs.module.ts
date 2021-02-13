import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreadcrumbsConfig } from './services/breadcrumbs.config';
import { BreadcrumbsService } from './services/breadcrumbs.service';
import { BreadcrumbsComponent } from './component/breadcrumbs.component';

// @dynamic
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [BreadcrumbsComponent],
  exports: [BreadcrumbsComponent],
})
export class BreadcrumbsModule {
  public static forRoot(config?: BreadcrumbsConfig): ModuleWithProviders<BreadcrumbsModule> {
    return {
      ngModule: BreadcrumbsModule,
      providers: [
        { provide: BreadcrumbsConfig, useFactory: () => new BreadcrumbsConfig(config) },
        BreadcrumbsService,
      ],
    };
  }
}
