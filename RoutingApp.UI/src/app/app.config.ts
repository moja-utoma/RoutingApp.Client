import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { MsalModule, MsalInterceptor, MsalGuard } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { MSALInstanceFactory } from '../main';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(
      MsalModule.forRoot(
        MSALInstanceFactory(),
        {
          interactionType: InteractionType.Redirect,
          authRequest: {
            scopes: [environment.api.scope],
          },
        },
        {
          interactionType: InteractionType.Redirect,
          protectedResourceMap: new Map([
            [environment.api.baseUrl + '/**', [environment.api.scope]],
          ]),
        }
      )
    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard,
  ],
};
