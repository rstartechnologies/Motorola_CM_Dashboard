import { BrowserModule }
  from '@angular/platform-browser';
import { NgModule }
  from '@angular/core';
import { AppComponent }
  from './app.component';
import { AppRoutingModule }
  from './app-routing.module';
import { MainLayoutModule }
  from './main-layout/main-layout.module';
import { HttpModule }
  from '@angular/http';
import { HttpClientModule }
  from '@angular/common/http';
import { LoginComponent } from './login/login.component';

import {
  OktaAuthModule,
  OktaCallbackComponent,
} from '@okta/okta-angular';
import { Routes, RouterModule }
  from '@angular/router';



// app.module.ts
import { EnvServiceProvider } from './env.service.provider';
import { CallbackComponent } from './callback.component';

import { ProtectedComponent } from './protected.component';
import { CookieService } from 'ngx-cookie-service';

const config = {
    url: 'https://motorolasolutions.okta.com/oauth2/default',
    clientId: '0oaa7ok51xruc9PBy1t7',
    issuer: 'https://motorolasolutions.okta.com/oauth2/default',
    redirectUri: 'https://svccontractmetrics-dev.mot-solutions.com/Motorola-CM-Dashboard/home/dashboard',
 
  // url: 'https://dev-661609.okta.com/oauth2/default',
  // clientId: '0oahj98soNTDc4c0M356',
  // issuer: 'https://dev-661609.okta.com/oauth2/default',
  // redirectUri: 'http://localhost:4000/Motorola-CM-Dashboard/home/dashboard',
}

export function onAuthRequired({ oktaAuth, router }) {
  // Redirect the user to your custom login page
  router.navigate(['/home/dashboard']);
}

const appRoutes: Routes = [
  {
    path: 'implicit/callback',
    component: CallbackComponent
  }
  // {
  //   path: 'protected',
  //   component: ProtectedComponent,
  //   canActivate: [ OktaAuthGuard ],
  //   data: {
  //     onAuthRequired
  //   }
  // },

]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProtectedComponent,
    CallbackComponent
    //  DashboardComponent
    // ScNewCasesComponent,
    // EbsCycleTimesComponent
    //AppSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainLayoutModule,
    HttpModule,
    HttpClientModule,

    RouterModule.forRoot(appRoutes),
    OktaAuthModule.initAuth(config)
  ], providers: [EnvServiceProvider,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }