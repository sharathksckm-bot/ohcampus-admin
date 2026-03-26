import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcollegedetailsComponent } from './editcollegedetails.component';

describe('EditcollegedetailsComponent', () => {
  let component: EditcollegedetailsComponent;
  let fixture: ComponentFixture<EditcollegedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditcollegedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcollegedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
