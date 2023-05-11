# Exalif Angular Libs

[![Build Status](https://travis-ci.org/exalif/angular-libs.svg?branch=master)](https://travis-ci.org/exalif/angular-libs)

Monorepo for various libs:

 - [@exalif/ngx-breadcrumbs](libs/ngx-breadcrumbs): breadcrumbs module
 - [@exalif/ngx-mat-popover](libs/ngx-mat-popover): angular material popover
 - [@exalif/ngx-skeleton-loader](libs/ngx-skeleton-loader): skeleton/ghost loader
 - [@exalif/ngx-file-upload](libs/ngx-file-upload): file upload module
 - [@exalif/ngx-k-code](libs/ngx-k-code): konami code module

## Notes

### @exalif/ngx-mat-popover

***BREAKING CHANGE***: From version 14 and upwards, SASS `@use '@angular/material' as mat` is removed from the lib file. Therefore to ensure proper styling, please set material theming in your main project style files.
