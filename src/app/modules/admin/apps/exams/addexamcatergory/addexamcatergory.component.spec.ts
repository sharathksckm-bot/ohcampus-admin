import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexamcatergoryComponent } from './addexamcatergory.component';

describe('AddexamcatergoryComponent', () => {
  let component: AddexamcatergoryComponent;
  let fixture: ComponentFixture<AddexamcatergoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddexamcatergoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddexamcatergoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
