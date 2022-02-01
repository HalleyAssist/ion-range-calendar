import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IonRangeCalendarComponent } from './ion-range-calendar.component';

describe('IonRangeCalendarComponent', () => {
  let component: IonRangeCalendarComponent;
  let fixture: ComponentFixture<IonRangeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IonRangeCalendarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IonRangeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
