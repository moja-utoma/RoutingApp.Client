import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPointsDetailsPage } from './delivery-points-details-page';

describe('DeliveryPointsDetails', () => {
  let component: DeliveryPointsDetailsPage;
  let fixture: ComponentFixture<DeliveryPointsDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPointsDetailsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryPointsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
