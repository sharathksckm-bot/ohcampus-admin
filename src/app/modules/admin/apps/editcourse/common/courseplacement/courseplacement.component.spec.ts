import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseplacementComponent } from './courseplacement.component';

describe('CourseplacementComponent', () => {
  let component: CourseplacementComponent;
  let fixture: ComponentFixture<CourseplacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseplacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
