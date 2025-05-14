import { Component, input, output } from '@angular/core';

import { CalendarMonth } from '../../calendar.types';
import { defaults } from '../../config';

@Component({
  selector: 'ion-range-calendar-month-picker',
  styleUrls: ['./month-picker.component.scss'],
  templateUrl: 'month-picker.component.html',
})
export class MonthPickerComponent {
  readonly month = input<CalendarMonth>(undefined);
  readonly color = input(defaults.COLOR);
  readonly monthFormat = input(defaults.MONTH_FORMAT, {
    transform: this.setMonthFormat,
  });

  select = output<number>();

  _thisMonth = new Date();

  MONTH_FORMAT = 'MMMM';

  _onSelect(month: number): void {
    this.select.emit(month);
  }

  getDate(month: number) {
    return new Date(this._thisMonth.getFullYear(), month, 1);
  }

  private setMonthFormat(value: string[]): string[] {
    if (value && value.length === 12) {
      return [...value];
    }
    return defaults.MONTH_FORMAT;
  }
}
