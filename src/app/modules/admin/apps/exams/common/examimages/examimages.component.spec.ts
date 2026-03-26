import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamimagesComponent } from './examimages.component';

describe('ExamimagesComponent', () => {
  let component: ExamimagesComponent;
  let fixture: ComponentFixture<ExamimagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamimagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamimagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
