import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbrouchuresComponent } from './ebrouchures.component';

describe('EbrouchuresComponent', () => {
  let component: EbrouchuresComponent;
  let fixture: ComponentFixture<EbrouchuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbrouchuresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EbrouchuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
