import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseenquirylistComponent } from './courseenquirylist.component';

describe('CourseenquirylistComponent', () => {
  let component: CourseenquirylistComponent;
  let fixture: ComponentFixture<CourseenquirylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseenquirylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseenquirylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
