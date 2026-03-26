import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcarcategoryComponent } from './addcarcategory.component';

describe('AddcarcategoryComponent', () => {
  let component: AddcarcategoryComponent;
  let fixture: ComponentFixture<AddcarcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcarcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcarcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
