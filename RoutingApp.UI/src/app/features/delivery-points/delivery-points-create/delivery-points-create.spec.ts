import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPointsCreate } from './delivery-points-create';

describe('DeliveryPointsCreate', () => {
  let component: DeliveryPointsCreate;
  let fixture: ComponentFixture<DeliveryPointsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPointsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPointsCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
