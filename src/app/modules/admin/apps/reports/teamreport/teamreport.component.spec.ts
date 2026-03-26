import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamreportComponent } from './teamreport.component';

describe('TeamreportComponent', () => {
  let component: TeamreportComponent;
  let fixture: ComponentFixture<TeamreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
