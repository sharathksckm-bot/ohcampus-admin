import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeventcategoryComponent } from './addeventcategory.component';

describe('AddeventcategoryComponent', () => {
  let component: AddeventcategoryComponent;
  let fixture: ComponentFixture<AddeventcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddeventcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeventcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
