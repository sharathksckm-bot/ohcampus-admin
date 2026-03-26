import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventimagesComponent } from './eventimages.component';

describe('EventimagesComponent', () => {
  let component: EventimagesComponent;
  let fixture: ComponentFixture<EventimagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventimagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventimagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
