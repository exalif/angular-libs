import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxKCodeDirective } from './ngx-k-code.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxKCodeDirective,
  ],
  exports: [
    NgxKCodeDirective,
  ]
})
export class NgxKCodeModule { }
