import { TestBed } from '@angular/core/testing';

import { RouteStreamManagerService } from './route-stream-manager-service';

describe('RouteStreamManagerService', () => {
  let service: RouteStreamManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteStreamManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
