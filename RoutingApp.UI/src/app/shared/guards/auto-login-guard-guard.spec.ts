import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { autoLoginGuardGuard } from './auto-login-guard-guard';

describe('autoLoginGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => autoLoginGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
