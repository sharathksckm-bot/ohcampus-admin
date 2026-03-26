import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictlistComponent } from './predictlist.component';

describe('PredictlistComponent', () => {
  let component: PredictlistComponent;
  let fixture: ComponentFixture<PredictlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
