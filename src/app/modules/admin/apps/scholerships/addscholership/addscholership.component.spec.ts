import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddscholershipComponent } from './addscholership.component';

describe('AddscholershipComponent', () => {
  let component: AddscholershipComponent;
  let fixture: ComponentFixture<AddscholershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddscholershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddscholershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
