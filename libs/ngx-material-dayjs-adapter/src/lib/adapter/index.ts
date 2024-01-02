import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MAT_DAYJS_DATE_ADAPTER_OPTIONS, DayjsDateAdapter } from './dayjs-date-adapter';
import { MAT_DAYJS_DATE_FORMATS } from './dayjs-date-formats';

export * from './dayjs-date-adapter';
export * from './dayjs-date-formats';

@NgModule({
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_DAYJS_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class DayjsDateModule { }

@NgModule({
  imports: [DayjsDateModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATE_FORMATS }],
})
export class MatDayjsDateModule { }
