import { CanActivateChildFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom, map } from 'rxjs';

export const AppAuthGuard: CanActivateChildFn = async (): Promise<boolean> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom(auth.isLoading$.pipe(map(loading => !loading)));

  const isAuth = await firstValueFrom(auth.isAuthenticated$);
  if (isAuth) return true;

  setTimeout(() => {
    // optionally: returnTo by passing { appState: { target: router.url } }
    auth.loginWithRedirect();
  }, 0);

  return false;
};