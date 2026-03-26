import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellingfeelistComponent } from './counsellingfeelist.component';

describe('CounsellingfeelistComponent', () => {
  let component: CounsellingfeelistComponent;
  let fixture: ComponentFixture<CounsellingfeelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounsellingfeelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounsellingfeelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
