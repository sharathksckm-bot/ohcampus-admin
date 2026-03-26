import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseractivitydataComponent } from './useractivitydata.component';

describe('UseractivitydataComponent', () => {
  let component: UseractivitydataComponent;
  let fixture: ComponentFixture<UseractivitydataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseractivitydataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseractivitydataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
