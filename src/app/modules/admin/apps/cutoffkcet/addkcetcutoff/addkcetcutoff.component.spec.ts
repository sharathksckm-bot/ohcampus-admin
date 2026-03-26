import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddkcetcutoffComponent } from './addkcetcutoff.component';

describe('AddkcetcutoffComponent', () => {
  let component: AddkcetcutoffComponent;
  let fixture: ComponentFixture<AddkcetcutoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddkcetcutoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddkcetcutoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
