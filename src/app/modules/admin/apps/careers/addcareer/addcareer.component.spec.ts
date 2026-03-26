import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcareerComponent } from './addcareer.component';

describe('AddcareerComponent', () => {
  let component: AddcareerComponent;
  let fixture: ComponentFixture<AddcareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcareerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
