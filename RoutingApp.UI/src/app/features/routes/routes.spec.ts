import { TestBed } from '@angular/core/testing';

import { Routes } from './routes';

describe('Routes', () => {
  let service: Routes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Routes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
