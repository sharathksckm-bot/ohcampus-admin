import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegetypeComponent } from './collegetype.component';

describe('CollegetypeComponent', () => {
  let component: CollegetypeComponent;
  let fixture: ComponentFixture<CollegetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
