import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPointsList } from './delivery-points-list';

describe('DeliveryPointsList', () => {
  let component: DeliveryPointsList;
  let fixture: ComponentFixture<DeliveryPointsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPointsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPointsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
