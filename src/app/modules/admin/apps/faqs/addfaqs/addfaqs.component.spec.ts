import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfaqsComponent } from './addfaqs.component';

describe('AddfaqsComponent', () => {
  let component: AddfaqsComponent;
  let fixture: ComponentFixture<AddfaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddfaqsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
