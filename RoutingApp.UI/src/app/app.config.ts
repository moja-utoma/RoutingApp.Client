import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MsalModule, MsalInterceptor, MsalGuard } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { MSALInstanceFactory } from '../main';

import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';

import { envAuth0, environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    //provideHttpClient(withInterceptorsFromDi()),

    provideAuth0({
      domain: envAuth0.domain,
      clientId: envAuth0.clientId,

      authorizationParams: {
        redirect_uri: envAuth0.redirectUri,
        audience: envAuth0.audience,
        scope: 'openid profile email read:current_user',
      },

      httpInterceptor: {
        allowedList: [
          {
            uri: envAuth0.audience+'*',
            tokenOptions: {
              authorizationParams: {
                audience: envAuth0.audience,
                scope: 'read:current_user',
              },
            },
          },
        ],
      },
    }),

    // importProvidersFrom(
    //   MsalModule.forRoot(
    //     MSALInstanceFactory(),
    //     {
    //       interactionType: InteractionType.Redirect,
    //       authRequest: {
    //         scopes: [environment.api.scope],
    //       },
    //     },
    //     {
    //       interactionType: InteractionType.Redirect,
    //       protectedResourceMap: new Map([
    //         [environment.api.baseUrl + '/**', [environment.api.scope]],
    //       ]),
    //     }
    //   )
    // ),

    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MsalInterceptor,
    //   multi: true,
    // },
    // MsalGuard,
  ],
};
