import { DirectiveWayComponent } from './directive-way/directive-way.component';
import { ServiceWayComponent } from './service-way/service-way.component';
import { ServiceCodeWayComponent } from './service-code-way/service-code-way.component';
import { OnPushComponent } from './on-push/on-push.component';

export const AppRoutes = [
  { path: '', redirectTo: 'directive-way', pathMatch: 'full' },
  { path: 'directive-way', component: DirectiveWayComponent },
  { path: 'service-way', component: ServiceWayComponent },
  { path: 'service-code-way', component: ServiceCodeWayComponent },
  { path: 'on-push', component: OnPushComponent },
];
