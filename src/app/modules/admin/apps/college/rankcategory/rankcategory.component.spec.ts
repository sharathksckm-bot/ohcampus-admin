import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankcategoryComponent } from './rankcategory.component';

describe('RankcategoryComponent', () => {
  let component: RankcategoryComponent;
  let fixture: ComponentFixture<RankcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankcategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
