import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegereportComponent } from './collegereport.component';

describe('CollegereportComponent', () => {
  let component: CollegereportComponent;
  let fixture: ComponentFixture<CollegereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
