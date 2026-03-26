import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsanslistComponent } from './questionsanslist.component';

describe('QuestionsanslistComponent', () => {
  let component: QuestionsanslistComponent;
  let fixture: ComponentFixture<QuestionsanslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsanslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsanslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
