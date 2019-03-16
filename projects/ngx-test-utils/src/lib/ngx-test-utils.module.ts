import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TranslatePipeMock } from './mocks/translate-pipe.mock';
import { RouterLinkMockDirective } from './mocks/router-link.mock';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TranslatePipeMock,
    RouterLinkMockDirective,
  ],
  exports: [
    TranslatePipeMock,
    RouterLinkMockDirective,
  ],
  providers: [
    DatePipe,
  ]
})
export class NgxTestUtilsModule { }
