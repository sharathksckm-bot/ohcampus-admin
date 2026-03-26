import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryyComponent } from './categoryy.component';

describe('CategoryyComponent', () => {
  let component: CategoryyComponent;
  let fixture: ComponentFixture<CategoryyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
