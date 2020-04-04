import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';

import { NgxMatPopoverComponent } from './ngx-mat-popover.component';

@NgModule({
  declarations: [NgxMatPopoverComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [NgxMatPopoverComponent]
})
export class NgxMatPopoverModule { }
