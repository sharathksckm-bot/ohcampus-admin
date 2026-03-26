import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableofcontentComponent } from './tableofcontent.component';

describe('TableofcontentComponent', () => {
  let component: TableofcontentComponent;
  let fixture: ComponentFixture<TableofcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableofcontentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableofcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
