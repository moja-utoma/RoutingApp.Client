import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDetailsPage } from './warehouse-details';

describe('WarehouseDetails', () => {
  let component: WarehouseDetailsPage;
  let fixture: ComponentFixture<WarehouseDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseDetailsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
