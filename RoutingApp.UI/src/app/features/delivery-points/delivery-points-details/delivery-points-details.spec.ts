import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPointsDetails } from './delivery-points-details';

describe('DeliveryPointsDetails', () => {
  let component: DeliveryPointsDetails;
  let fixture: ComponentFixture<DeliveryPointsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPointsDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPointsDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
