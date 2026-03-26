import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceexamsComponent } from './entranceexams.component';

describe('EntranceexamsComponent', () => {
  let component: EntranceexamsComponent;
  let fixture: ComponentFixture<EntranceexamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntranceexamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntranceexamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
