import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrankcategoryComponent } from './addrankcategory.component';

describe('AddrankcategoryComponent', () => {
  let component: AddrankcategoryComponent;
  let fixture: ComponentFixture<AddrankcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddrankcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddrankcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
