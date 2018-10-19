# @exalif/ngx-breadcrumbs
An Angular (4+) module generating breadcrumbs based on the routing state.

This package is a modified fork of original [ngx-breadcrumbs](https://github.com/McNull/ngx-breadcrumbs) package by McNull

## Requirements

**Caution**: Version **>=7.0.0** requires:
 - `rxjs` **>=6.3.0**
 - `@angular`  **>=7.0.0**

**Caution**: Version **>=6.0.0** requires:
 - `rxjs` **>=6.0.0**
 - `@angular`  **>=6.0.0**

## Installation
```bash
# install via npm
$ npm --save install @exalif/ngx-breadcrumbs
```
```bash
# install via yarn
$ yarn add @exalif/ngx-breadcrumbs
```

## Usage

Import the `BreadcrumbsModule` in your root module (`app.module.ts`) after 
importing the _router_ module. 

```typescript
import { RouterModule } from '@angular/router';
import { BreadcrumbsModule } from '@exalif/ngx-breadcrumbs';

@NgModule({
  imports: [
    RouterModule.forRoot(myRoutes),
    BreadcrumbsModule.forRoot()
  ],  
})
export class AppModule {}
```

Place the `breadcrumbs` component, which will render the breadcrumbs, 
somewhere in your markup.

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <breadcrumbs></breadcrumbs>
      <router-outlet></router-outlet>
    </div>`
})
export class AppComponent {}
```

Usage of the `breadcrumbs` render component is optional. If a different 
markup output is desired, a custom component can be created that subscribes to 
the `BreadcrumbsService.crumbs$` observable (also available through method `BreadcrumbsService.getCrumbs()`).

### Routing Configuration

Breadcrumbs links are generated based on the route configuration. If a route 
entry contains a `data.breadcrumbs` property the _breadcrumbs service_ assumes 
breadcrumbs should be created whenever this route or one its child routes are 
active. 

```typescript
const myRoutes : Route[] = {
  {
    path: '',
    component: HomeComponent,
    data: {
      // Uses static text (Home)
      breadcrumbs: 'Home' 
    }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      // Uses last urlfragment (about) as text
      breadcrumbs: true 
    }
  },
  {
    path: 'person',
    data: {
      // Uses text property (Person)
      breadcrumbs: true,
      text: 'Person'
    },
    children: [
      {
          path: '',
          component: PersonListComponent
      },
      {
          path: ':id',
          component: PersonDetailComponent,
          data: {
            // Interpolates values resolved by the router 
            breadcrumbs: '{{ person.name }}'
          },
          resolve: {
            person: PersonResolver
          }
      } 
    ]
  },    
  {
    path: 'folder',
    data: {
      // Uses static text 'Folder'
      breadcrumbs: 'Folder'
    },
    children: [
      {
      path: '',
      component: FolderComponent
      },
      {
        path: ':id',
        component: FolderComponent,
        data: {
          // Resolves the breadcrumbs for this route by
          // implementing a BreadcrumbsResolver class.
          breadcrumbs: FolderBreadcrumbsResolver
        }
      }
    ]
  }
};
```

### API

#### Breadcrumb
The `Breadcrumb` interface defines the properties of the breadcrumb items.

```typescript
export interface Breadcrumb {
  text: string,  // The text to display 
  path: string   // The associated path
}
```

#### BreadcrumbsComponent
The component simply renders the list of the `Breadcrumb` items provided by the `BreadcrumbsService`. 

A custom breadcrumb component is easily created by injecting the breadcrumb 
service and iterating over the breadcrumb items. 

##### Styling

The following CSS classes can be used for styling purpose:

  * `breadcrumbs__container`: `ol` list container
  * `breadcrumbs__item`: each breadcrum `li` element
  * `breadcrumbs__item--active`: added on last `li` element (current active link)

Each breadcrumb `li` element contains a `a` link and a `span` text element.

#### BreadcrumbsService
The service has one public property `crumbs$`. It's an observable stream of 
`Breadcrumb[]`, which is updated after each route change.  

#### BreadcrumbsResolver
If needed, a custom resolver can be implemented which is activated whenever a 
certain route becomes active. This can be useful whenever the route 
configuration cannot match the desired breadcrumb hierachy. 

The signature of the resolver implements `Resolve<T>` from the 
[Angular Router](https://angular.io/api/router/Resolve) and needs to resolve an 
array of `Breadcrumb` items. 

To associate a route with a certain resolver, its breadcrumbs data property in 
the route configuration should point to the resolver:

```typescript
const myRoutes = [
  {
    path: 'somepath',
    component: SomeComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver
    }
  }
];
```

##### Members

```typescript
// Should resolve zero or more Breadcrumb items.
public function resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : Observable<T> | Promise<T> | T 
```

```typescript
// Helper function that returns the full path for the provided route snapshot.
public function getFullPath(route: ActivatedRouteSnapshot) 
  : string
```

To access parent member without redeclaring method, use `super`. e.g: `super.getFullPath(route)`.

##### Example using a custom resolver and custom Breadcrumb interface

```typescript

export interface MyBreadcrumb extends Breadcrumb {
  icon?: string;
}

@Injectable()
export class MyBreadcrumbsResolver inherits BreadcrumbsResolver {

  // Optional: inject any required dependencies
  constructor(private myService: MyService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MyBreadcrumb[] {    
    const myFolderId = route.params.id;
    const icon: string = route.data.icon ? route.data.icon : null;

    const myCrumbs = 
      this.myService.getFolders(myFolderId).pipe(
        .map((folder) => ({
          text: folder.title,
          icon
          path: super.getFullPath(route.parent) + '/' + folder.id
        }));

    return myCrumbs; 
  }
}
```

*Note*: the resolve method must return one of the following types:
  * `Breadcrumb[]`
  * `Observable<Breadcrumb[]>`
  * `Promise<Breadcrumb>`

#### BreadcrumbsConfig
The configuration of the breadcrumbs module. 

##### Members

**postProcess**

Callback function with the following signature:

```typescript
function (crumbs: Breadcrumb[]): Promise<Breadcrumb[]> | Observable<Breadcrumb[]> | Breadcrumb[];
```

Can be used to make custom changes to the breadcrumb array after the service
has constructed the breadcrumb trail.

Example:
```typescript
@NgModule({
  /* ... */
})
export class AppModule {
  constructor(breadcrumbsConfig: BreadcrumbsConfig) {

    breadcrumbsConfig.postProcess = (breadcrumbs): Breadcrumb[] => {

      // Ensure that the first breadcrumb always points to home
      let processedBreadcrumbs = breadcrumbs;

      if(breadcrumbs.length && breadcrumbs[0].text !== 'Home') {
        processedBreadcrumbs = [
          {
            text: 'Home',
            path: ''
          }
        ].concat(breadcrumbs);
      }

      return processedBreadcrumbs;
    };
  }
}
```
