import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursebroucherComponent } from './coursebroucher.component';

describe('CoursebroucherComponent', () => {
  let component: CoursebroucherComponent;
  let fixture: ComponentFixture<CoursebroucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursebroucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursebroucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
