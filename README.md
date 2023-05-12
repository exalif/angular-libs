# Exalif Angular Libs

![Build Status](https://github.com/exalif/angular-libs/actions/workflows/branch-master.yml/badge.svg)

Monorepo for various libs:

 - [@exalif/ngx-breadcrumbs](libs/ngx-breadcrumbs): breadcrumbs module
 - [@exalif/ngx-mat-popover](libs/ngx-mat-popover): angular material popover
 - [@exalif/ngx-skeleton-loader](libs/ngx-skeleton-loader): skeleton/ghost loader
 - [@exalif/ngx-file-upload](libs/ngx-file-upload): file upload module
 - [@exalif/ngx-k-code](libs/ngx-k-code): konami code module
 - [@exalif/ngx-keepalive](libs/ngx-keepalive): a module for responding to idle users in Angular applications

## Notes

### @exalif/ngx-mat-popover

***BREAKING CHANGE***: From version 14 and upwards, SASS `@use '@angular/material' as mat` is removed from the lib file. Therefore to ensure proper styling, please set material theming in your main project style files.
