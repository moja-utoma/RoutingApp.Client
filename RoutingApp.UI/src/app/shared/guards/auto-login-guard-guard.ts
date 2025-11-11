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
    tap(() => {})
  );
};
