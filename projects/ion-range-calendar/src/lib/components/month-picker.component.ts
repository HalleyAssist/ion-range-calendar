import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarMonth } from '../calendar.model';
import { defaults } from '../config';

@Component({
  selector: 'ion-range-calendar-month-picker',
  styleUrls: ['./month-picker.component.scss'],
  templateUrl: 'month-picker.component.html',
})
export class MonthPickerComponent {
  @Input()
  month: CalendarMonth;
  @Input()
  color = defaults.COLOR;
  @Output()
  select: EventEmitter<number> = new EventEmitter();
  _thisMonth = new Date();
  _monthFormat = defaults.MONTH_FORMAT;

  MONTH_FORMAT = 'MMMM';

  @Input()
  set monthFormat(value: string[]) {
    if (Array.isArray(value) && value.length === 12) {
      this._monthFormat = value;
    }
  }

  get monthFormat(): string[] {
    return this._monthFormat;
  }

  constructor() { }

  _onSelect(month: number): void {
    this.select.emit(month);
  }

  getDate(month: number) {
    return new Date(this._thisMonth.getFullYear(), month, 1);
  }
}
