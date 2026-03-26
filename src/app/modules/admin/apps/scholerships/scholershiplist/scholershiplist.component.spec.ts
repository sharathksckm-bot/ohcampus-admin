import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholershiplistComponent } from './scholershiplist.component';

describe('ScholershiplistComponent', () => {
  let component: ScholershiplistComponent;
  let fixture: ComponentFixture<ScholershiplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholershiplistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholershiplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
