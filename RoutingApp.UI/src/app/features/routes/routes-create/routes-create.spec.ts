import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesCreate } from './routes-create';

describe('RoutesCreate', () => {
  let component: RoutesCreate;
  let fixture: ComponentFixture<RoutesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutesCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
