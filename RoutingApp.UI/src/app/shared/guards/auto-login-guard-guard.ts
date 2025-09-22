import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

export const AutoLoginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  return auth.isAuthenticated$.pipe(
    tap((isAuth) => {
      if (!isAuth) {
        auth.loginWithRedirect();
      }
    }),
    // Prevent navigation until login completes
    // Returning false avoids route activation
    // Returning true allows navigation (if already authenticated)
    // Returning of(false) avoids redirect loop
    // You can fine-tune this based on your UX
    tap(() => {})
  );
};
