# @exalif/ngx-skeleton-loader

This package is a modified fork of original [ngx-skeleton-loader](https://github.com/willmendesneto/ngx-skeleton-loader#) package by willmendesneto. Forked from commit [9ca6c5](9ca6c58a03bdbbbe85706152fa5e897820ed4ce3). License of original package preserved as is.


## Install

You can get it on NPM installing `@exalif/ngx-skeleton-loader` module as a project dependency.

```shell
npm install @exalif/ngx-skeleton-loader --save
```

## Setup

You'll need to add `NgxSkeletonLoaderModule` to your application module. So that, the `<ngx-skeleton-loader>` components will be accessible in your application.

```typescript
...
import { NgxSkeletonLoaderModule } from '@exalif/ngx-skeleton-loader';
...

@NgModule({
  declarations: [
    YourAppComponent
  ],
  imports: [
    ...
    NgxSkeletonLoaderModule,
    ...
  ],
  providers: [],
  bootstrap: [YourAppComponent]
})

export class YourAppComponent {}

```

After that, you can use the `ngx-skeleton-loader` components in your templates, passing the configuration data into the component itself.

- `ngx-skeleton-loader`: Handle the skeleton animation and the skeleton styles of your app;

```html
<div class="item"><ngx-skeleton-loader count="5" appearance="circle"> </ngx-skeleton-loader></div>
```

### Generating multiple skeletons

You can use, in combination of `count` attribute, multiple appearances and themes on a single element. Theme and appearance will be applied depending on each generated loader, depending on index.

```html
<div class="item">
  <ngx-skeleton-loader
    count="3"
    [appearance]="['circle', '', '']"
    [theme]="[
      { width: '20px' },
      { width: '60%' },
      { width: '70%' }
    ]"
  >
  </ngx-skeleton-loader>
</div>
```
*Note*: in case insufficient number of `appearance`/`theme` is provided compared to comply with `count` value, the library will use the first array values of `appearance` and `theme` to style the loader.
