import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementstatisticsComponent } from './placementstatistics.component';

describe('PlacementstatisticsComponent', () => {
  let component: PlacementstatisticsComponent;
  let fixture: ComponentFixture<PlacementstatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementstatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementstatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
