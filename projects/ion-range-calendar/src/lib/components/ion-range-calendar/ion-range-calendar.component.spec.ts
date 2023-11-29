import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { IonRangeCalendarComponent } from './ion-range-calendar.component';
import { CalendarWeekComponent } from '../calendar-week/calendar-week.component';
import { MonthComponent } from '../month/month.component';

describe('IonRangeCalendarComponent', () => {
  let component: IonRangeCalendarComponent;
  let fixture: ComponentFixture<IonRangeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IonRangeCalendarComponent,
        CalendarWeekComponent,
        MonthComponent,
      ],
      imports: [
        FormsModule,
        IonicModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IonRangeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
