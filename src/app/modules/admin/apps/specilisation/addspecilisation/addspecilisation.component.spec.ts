import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddspecilisationComponent } from './addspecilisation.component';

describe('AddspecilisationComponent', () => {
  let component: AddspecilisationComponent;
  let fixture: ComponentFixture<AddspecilisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddspecilisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddspecilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
