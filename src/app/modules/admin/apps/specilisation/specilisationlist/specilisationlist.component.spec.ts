import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecilisationlistComponent } from './specilisationlist.component';

describe('SpecilisationlistComponent', () => {
  let component: SpecilisationlistComponent;
  let fixture: ComponentFixture<SpecilisationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecilisationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecilisationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
