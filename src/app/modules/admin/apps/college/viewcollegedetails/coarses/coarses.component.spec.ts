import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoarsesComponent } from './coarses.component';

describe('CoarsesComponent', () => {
  let component: CoarsesComponent;
  let fixture: ComponentFixture<CoarsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoarsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoarsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
