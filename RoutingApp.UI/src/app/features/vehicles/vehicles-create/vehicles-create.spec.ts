import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesCreate } from './vehicles-create';

describe('VehiclesCreate', () => {
  let component: VehiclesCreate;
  let fixture: ComponentFixture<VehiclesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
