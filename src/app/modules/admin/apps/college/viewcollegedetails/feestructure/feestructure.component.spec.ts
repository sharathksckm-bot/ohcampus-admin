import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeestructureComponent } from './feestructure.component';

describe('FeestructureComponent', () => {
  let component: FeestructureComponent;
  let fixture: ComponentFixture<FeestructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeestructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeestructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
