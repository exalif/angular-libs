import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { DirectiveWayComponent } from './directive-way/directive-way.component';
import { ServiceWayComponent } from './service-way/service-way.component';
import { ServiceCodeWayComponent } from './service-code-way/service-code-way.component';
import { OnPushComponent } from './on-push/on-push.component';
import { NgxFileUploadModule } from 'projects/ngx-file-upload/src/lib/ngx-file-upload.module';

@NgModule({
  declarations: [
    AppComponent,
    DirectiveWayComponent,
    ServiceWayComponent,
    ServiceCodeWayComponent,
    OnPushComponent
  ],
  imports: [RouterModule.forRoot(AppRoutes), BrowserModule, NgxFileUploadModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
