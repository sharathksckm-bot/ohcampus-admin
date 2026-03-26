import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseeligibilityComponent } from './courseeligibility.component';

describe('CourseeligibilityComponent', () => {
  let component: CourseeligibilityComponent;
  let fixture: ComponentFixture<CourseeligibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseeligibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseeligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
