import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddblogcategoryComponent } from './addblogcategory.component';

describe('AddblogcategoryComponent', () => {
  let component: AddblogcategoryComponent;
  let fixture: ComponentFixture<AddblogcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddblogcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddblogcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
