import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitiessComponent } from './facilitiess.component';

describe('FacilitiessComponent', () => {
  let component: FacilitiessComponent;
  let fixture: ComponentFixture<FacilitiessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilitiessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitiessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
