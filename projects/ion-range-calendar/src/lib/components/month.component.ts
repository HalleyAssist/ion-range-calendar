import { Component, ChangeDetectorRef, Input, Output, EventEmitter, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarDay, CalendarMonth, CalendarOriginal, PickMode } from '../calendar.model';
import { defaults } from '../config';

export const MONTH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MonthComponent),
  multi: true,
};

@Component({
  selector: 'ion-range-calendar-month',
  providers: [MONTH_VALUE_ACCESSOR],
  styleUrls: ['./month.component.scss'],
  templateUrl: 'month.component.html',
  host: { '[class.component-mode]': 'componentMode' },
})
export class MonthComponent implements ControlValueAccessor, AfterViewInit {

  @Input() componentMode = false;
  @Input()
  month: CalendarMonth;
  @Input()
  pickMode: PickMode;
  @Input()
  isSaveHistory: boolean;
  @Input()
  id: any;
  @Input()
  readonly = false;
  @Input()
  color: string = defaults.COLOR;

  @Output()
  change: EventEmitter<CalendarDay[]> = new EventEmitter();
  @Output()
  select: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  selectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  selectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  _date: Array<CalendarDay | null> = [null, null];
  _isInit = false;
  _onChanged: Function;
  _onTouched: Function;

  readonly DAY_DATE_FORMAT = 'MMMM dd, yyyy';

  get _isRange(): boolean {
    return this.pickMode === 'range';
  }

  constructor(public ref: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this._isInit = true;
  }

  get value() {
    return this._date;
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this._date = obj;
    }
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  trackByTime(index: number, item: CalendarDay): number {
    return item.time;
  }

  isEndSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== 'range' || !this._isInit || this._date[1] === null) {
      return false;
    }

    return this._date[1].time === day.time;
  }

  getDayLabel(day: CalendarDay) {
    return new Date(day.time);
  }

  isBetween(day: CalendarDay): boolean {
    if (!day) return false;

    if (this.pickMode !== 'range' || !this._isInit) {
      return false;
    }

    if (this._date[0] === null || this._date[1] === null) {
      return false;
    }

    const start = this._date[0].time;
    const end = this._date[1].time;

    return day.time < end && day.time > start;
  }

  isStartSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== 'range' || !this._isInit || this._date[0] === null) {
      return false;
    }

    return this._date[0].time === day.time && this._date[1] !== null;
  }

  isSelected(time: number): boolean {
    if (Array.isArray(this._date)) {
      if (this.pickMode !== 'multi') {
        if (this._date[0] !== null) {
          return time === this._date[0].time;
        }

        if (this._date[1] !== null) {
          return time === this._date[1].time;
        }
      } else {
        return this._date.findIndex(e => e !== null && e.time === time) !== -1;
      }
    }
    return false;
  }

  onSelected(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.select.emit(item);
    if (this.pickMode === 'single') {
      this._date[0] = item;
      this.change.emit(this._date);
      return;
    }

    if (this.pickMode === 'range') {
      if (this._date[0] === null) {
        this._date[0] = item;
        this.selectStart.emit(item);
      } else if (this._date[1] === null) {
        if (this._date[0].time < item.time) {
          this._date[1] = item;
          this.selectEnd.emit(item);
        } else {
          this._date[1] = this._date[0];
          this.selectEnd.emit(this._date[0]);
          this._date[0] = item;
          this.selectStart.emit(item);
        }
      } else if (this._date[0].time > item.time) {
        this._date[0] = item;
        this.selectStart.emit(item);
      } else if (this._date[1].time < item.time) {
        this._date[1] = item;
        this.selectEnd.emit(item);
      } else {
        this._date[0] = item;
        this.selectStart.emit(item);
        this._date[1] = null;
      }

      this.change.emit(this._date);
      return;
    }

    if (this.pickMode === 'multi') {
      const index = this._date.findIndex(e => e !== null && e.time === item.time);

      if (index === -1) {
        this._date.push(item);
      } else {
        this._date.splice(index, 1);
      }
      this.change.emit(this._date.filter(e => e !== null));
    }
  }
}
