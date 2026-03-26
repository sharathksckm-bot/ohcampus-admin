import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewstatusComponent } from './addnewstatus.component';

describe('AddnewstatusComponent', () => {
  let component: AddnewstatusComponent;
  let fixture: ComponentFixture<AddnewstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
