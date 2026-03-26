import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcollegesComponent } from './addcolleges.component';

describe('AddcollegesComponent', () => {
  let component: AddcollegesComponent;
  let fixture: ComponentFixture<AddcollegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcollegesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
