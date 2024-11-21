import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonToolbar } from '@ionic/angular/standalone';

import { CalendarWeekComponent } from '../calendar-week/calendar-week.component';
import { MonthComponent } from '../month/month.component';
import { IonRangeCalendarComponent } from './ion-range-calendar.component';

describe('IonRangeCalendarComponent', () => {
  let component: IonRangeCalendarComponent;
  let fixture: ComponentFixture<IonRangeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        IonRangeCalendarComponent,
        CalendarWeekComponent,
        MonthComponent,

        IonButton,
        IonIcon,
        IonToolbar,
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
