import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxFileUploadDirective } from './ngx-file-upload.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxFileUploadDirective],
  exports: [NgxFileUploadDirective]
})
export class NgxFileUploadModule { }
