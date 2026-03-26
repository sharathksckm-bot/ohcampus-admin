import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqslistComponent } from './faqslist.component';

describe('FaqslistComponent', () => {
  let component: FaqslistComponent;
  let fixture: ComponentFixture<FaqslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
