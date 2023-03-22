import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

import { NgxMatPopoverComponent } from './ngx-mat-popover.component';

@NgModule({
  declarations: [NgxMatPopoverComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [NgxMatPopoverComponent]
})
export class NgxMatPopoverModule { }
