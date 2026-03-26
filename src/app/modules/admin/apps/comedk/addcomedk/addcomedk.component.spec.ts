import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcomedkComponent } from './addcomedk.component';

describe('AddcomedkComponent', () => {
  let component: AddcomedkComponent;
  let fixture: ComponentFixture<AddcomedkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcomedkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcomedkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
