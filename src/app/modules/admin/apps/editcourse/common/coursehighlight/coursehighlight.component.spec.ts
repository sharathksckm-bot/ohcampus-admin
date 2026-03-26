import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursehighlightComponent } from './coursehighlight.component';

describe('CoursehighlightComponent', () => {
  let component: CoursehighlightComponent;
  let fixture: ComponentFixture<CoursehighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursehighlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursehighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
