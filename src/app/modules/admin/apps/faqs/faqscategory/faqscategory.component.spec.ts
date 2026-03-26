import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqscategoryComponent } from './faqscategory.component';

describe('FaqscategoryComponent', () => {
  let component: FaqscategoryComponent;
  let fixture: ComponentFixture<FaqscategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqscategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqscategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
