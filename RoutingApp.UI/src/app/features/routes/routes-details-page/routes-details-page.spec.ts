import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesDetailsPage } from './routes-details-page';

describe('RoutesDetailsPage', () => {
  let component: RoutesDetailsPage;
  let fixture: ComponentFixture<RoutesDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutesDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
