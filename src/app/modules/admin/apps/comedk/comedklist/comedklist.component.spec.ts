import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComedklistComponent } from './comedklist.component';

describe('ComedklistComponent', () => {
  let component: ComedklistComponent;
  let fixture: ComponentFixture<ComedklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComedklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComedklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
