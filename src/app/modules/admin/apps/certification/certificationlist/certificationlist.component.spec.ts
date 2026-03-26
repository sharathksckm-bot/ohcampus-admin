import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationlistComponent } from './certificationlist.component';

describe('CertificationlistComponent', () => {
  let component: CertificationlistComponent;
  let fixture: ComponentFixture<CertificationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
