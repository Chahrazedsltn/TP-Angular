import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteoCarte } from './meteo-carte';

describe('MeteoCarte', () => {
  let component: MeteoCarte;
  let fixture: ComponentFixture<MeteoCarte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeteoCarte],
    }).compileComponents();

    fixture = TestBed.createComponent(MeteoCarte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
