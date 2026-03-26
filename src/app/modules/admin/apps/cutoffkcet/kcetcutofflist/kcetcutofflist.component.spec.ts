import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcetcutofflistComponent } from './kcetcutofflist.component';

describe('KcetcutofflistComponent', () => {
  let component: KcetcutofflistComponent;
  let fixture: ComponentFixture<KcetcutofflistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KcetcutofflistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcetcutofflistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
