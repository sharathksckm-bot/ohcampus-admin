import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcounsellingfeeComponent } from './addcounsellingfee.component';

describe('AddcounsellingfeeComponent', () => {
  let component: AddcounsellingfeeComponent;
  let fixture: ComponentFixture<AddcounsellingfeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcounsellingfeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcounsellingfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
