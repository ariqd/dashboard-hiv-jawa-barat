import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCitiesComponent } from './barCities.component';

describe('BarCitiesComponent', () => {
  let component: BarCitiesComponent;
  let fixture: ComponentFixture<BarCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarCitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
