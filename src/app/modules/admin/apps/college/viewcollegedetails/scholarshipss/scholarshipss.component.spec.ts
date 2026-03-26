import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipssComponent } from './scholarshipss.component';

describe('ScholarshipssComponent', () => {
  let component: ScholarshipssComponent;
  let fixture: ComponentFixture<ScholarshipssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarshipssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
