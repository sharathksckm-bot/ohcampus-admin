import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteranceexamComponent } from './enteranceexam.component';

describe('EnteranceexamComponent', () => {
  let component: EnteranceexamComponent;
  let fixture: ComponentFixture<EnteranceexamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnteranceexamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnteranceexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
