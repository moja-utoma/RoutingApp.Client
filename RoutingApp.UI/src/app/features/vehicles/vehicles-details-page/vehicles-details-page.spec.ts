import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesDetailsPage } from './vehicles-details-page';

describe('VehiclesDetailsPage', () => {
  let component: VehiclesDetailsPage;
  let fixture: ComponentFixture<VehiclesDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
