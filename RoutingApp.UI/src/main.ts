import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { MsalModule, MsalInterceptor, MsalService } from '@azure/msal-angular';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
} from '@azure/msal-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from './environments/environment';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msal.auth.clientId,
      authority: environment.msal.auth.authority,
      redirectUri: environment.msal.auth.redirectUri,
    },
  });
}


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
