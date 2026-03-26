import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoneventcategoryComponent } from './commoneventcategory.component';

describe('CommoneventcategoryComponent', () => {
  let component: CommoneventcategoryComponent;
  let fixture: ComponentFixture<CommoneventcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoneventcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoneventcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
