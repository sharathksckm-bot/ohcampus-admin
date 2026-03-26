import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamdocsComponent } from './examdocs.component';

describe('ExamdocsComponent', () => {
  let component: ExamdocsComponent;
  let fixture: ComponentFixture<ExamdocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamdocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamdocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
