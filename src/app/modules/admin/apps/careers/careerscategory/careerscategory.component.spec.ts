import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerscategoryComponent } from './careerscategory.component';

describe('CareerscategoryComponent', () => {
  let component: CareerscategoryComponent;
  let fixture: ComponentFixture<CareerscategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerscategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerscategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
