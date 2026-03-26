import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcertificationComponent } from './addcertification.component';

describe('AddcertificationComponent', () => {
  let component: AddcertificationComponent;
  let fixture: ComponentFixture<AddcertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcertificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
