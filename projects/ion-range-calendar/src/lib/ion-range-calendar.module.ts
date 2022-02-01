import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { IonRangeCalendarService } from './services/ion-range-calendar.service';

import { CalendarModalOptions } from './calendar.model';
import {
  IonRangeCalendarComponent,
  CalendarModal,
  CalendarWeekComponent,
  MonthComponent,
  MonthPickerComponent
} from './components';

import { DEFAULT_CALENDAR_OPTIONS } from './services/calendar-options.provider';

const components = [
  IonRangeCalendarComponent,
  CalendarModal,
  CalendarWeekComponent,
  MonthComponent,
  MonthPickerComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  providers: [
    IonRangeCalendarService,
  ],
  exports: components,
})
export class IonRangeCalendarModule {
  static forRoot(defaultOptions: CalendarModalOptions = {}) {
    return {
      ngModule: IonRangeCalendarModule,
      providers: [
        { provide: DEFAULT_CALENDAR_OPTIONS, useValue: defaultOptions }
      ]
    };
  }
}
