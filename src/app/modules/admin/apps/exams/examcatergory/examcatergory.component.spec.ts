import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamcatergoryComponent } from './examcatergory.component';

describe('ExamcatergoryComponent', () => {
  let component: ExamcatergoryComponent;
  let fixture: ComponentFixture<ExamcatergoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamcatergoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamcatergoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
