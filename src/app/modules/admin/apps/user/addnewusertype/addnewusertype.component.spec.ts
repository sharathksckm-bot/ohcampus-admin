import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewusertypeComponent } from './addnewusertype.component';

describe('AddnewusertypeComponent', () => {
  let component: AddnewusertypeComponent;
  let fixture: ComponentFixture<AddnewusertypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewusertypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewusertypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
