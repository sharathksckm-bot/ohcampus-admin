import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcollegetypeComponent } from './addcollegetype.component';

describe('AddcollegetypeComponent', () => {
  let component: AddcollegetypeComponent;
  let fixture: ComponentFixture<AddcollegetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcollegetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcollegetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
