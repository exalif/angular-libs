import { DirectiveWayComponent } from './directive-way/directive-way.component';
import { ServiceWayComponent } from './service-way/service-way.component';
import { ServiceCodeWayComponent } from './service-code-way/service-code-way.component';
import { OnPushComponent } from './on-push/on-push.component';
import { EmptyComponent } from './empty.component';

export const AppRoutes = [
  { path: 'upload/directive', component: DirectiveWayComponent },
  { path: 'upload/service', component: ServiceWayComponent },
  { path: 'upload/service-code', component: ServiceCodeWayComponent },
  { path: 'upload/on-push', component: OnPushComponent },
  { path: '', component: EmptyComponent }
];
