import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanlistComponent } from './loanlist.component';

describe('LoanlistComponent', () => {
  let component: LoanlistComponent;
  let fixture: ComponentFixture<LoanlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
