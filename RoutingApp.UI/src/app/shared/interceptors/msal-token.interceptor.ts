import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class MsalTokenInterceptor implements HttpInterceptor {
  constructor(private msalService: MsalService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token injection for requests not to the API
    if (!req.url.startsWith(environment.api.baseUrl)) {
      return next.handle(req);
    }

    const account = this.msalService.instance.getActiveAccount();

    if (!account) {
      // No active account → don’t redirect here immediately
      console.warn('No active account, user must login.');
      return throwError(() => new Error('User not logged in'));
    }

    // Acquire token silently
    return from(
      this.msalService.acquireTokenSilent({
        account: account,
        scopes: [environment.api.scope],
      })
    ).pipe(
      switchMap((tokenResponse) => {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${tokenResponse.accessToken}` },
        });
        return next.handle(cloned);
      }),
      catchError((err) => {
        console.warn('Silent token acquisition failed:', err);

        // Only redirect if the error is not during a redirect callback
        const errorMessage = err?.errorMessage || '';
        if (!errorMessage.includes('interaction_in_progress')) {
          // Trigger interactive login
          this.msalService.loginRedirect({
            scopes: [environment.api.scope],
          });
        }

        return throwError(() => err);
      })
    );
  }
}
