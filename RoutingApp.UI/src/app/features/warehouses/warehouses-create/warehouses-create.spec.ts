import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousesCreate } from './warehouses-create';

describe('WarehousesCreate', () => {
  let component: WarehousesCreate;
  let fixture: ComponentFixture<WarehousesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousesCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
