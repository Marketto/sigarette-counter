import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoldDirective } from './core/directives/hold.directive';
import { SigaretteComponent } from './pages/sigarette/sigarette.component';
import { StatsComponent } from './pages/stats/stats.component';
import * as moment from 'moment';
import locale from '@angular/common/locales/it';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiService } from './core/services/api.service';
import { DataService } from './core/services/data.service';
registerLocaleData(locale);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    SigaretteComponent,
    StatsComponent,
    HoldDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: environment.authDomain,
      clientId: environment.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        // Request this audience at user authentication time
        audience: `https://${environment.authDomain}/api/v2/`,
        // Request this scope at user authentication time
        scope: 'read:current_user',
      },
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://{yourDomain}/api/v2/' (note the asterisk)
            uri: `https://${environment.authDomain}/api/v2/*`,
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: `https://${environment.authDomain}/api/v2/`,
                // The attached token should have these scopes
                scope: 'read:current_user',
              },
            },
          },
          {
            // Match any request that starts 'https://{yourDomain}/api/v2/' (note the asterisk)
            uri: `${environment.apiBaseUri}/*`,
          },
        ],
      },
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: navigator.language,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    moment.locale(navigator.language);
  }
}
