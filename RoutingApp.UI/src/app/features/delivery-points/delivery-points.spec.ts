import { TestBed } from '@angular/core/testing';

import { DeliveryPoints } from './delivery-points';

describe('DeliveryPoints', () => {
  let service: DeliveryPoints;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryPoints);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
