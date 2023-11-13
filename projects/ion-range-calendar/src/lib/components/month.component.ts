import { Component, ChangeDetectorRef, Input, Output, EventEmitter, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IonRangeCalendarService } from '../services/ion-range-calendar.service';

import { CalendarDay, CalendarMonth, PickMode } from '../calendar.model';

import { defaults } from '../config';
import { addDays, isAfter, startOfDay, subDays } from 'date-fns';

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
  @Input() month: CalendarMonth;
  @Input() pickMode: PickMode;
  @Input() isSaveHistory: boolean;
  @Input() id: any;
  @Input() readonly = false;
  @Input() color: string = defaults.COLOR;

  @Output() change: EventEmitter<CalendarDay[]> = new EventEmitter();
  @Output() select: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() selectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() selectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  _date: Array<CalendarDay | null> = [null, null];
  _isInit = false;
  _onChanged: Function;
  _onTouched: Function;

  readonly DAY_DATE_FORMAT = 'MMMM dd, yyyy';

  get _isRange(): boolean {
    return this.pickMode === 'range';
  }

  constructor(
    public ref: ChangeDetectorRef,
    public service: IonRangeCalendarService,
  ) { }

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
    return item ? item.time : index;
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

    return day.time < this._date[1].time && day.time > this._date[0].time;
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
    this.select.emit(item);
    if (this.pickMode === 'single') {
      this._date[0] = item;
      this.change.emit(this._date);
      return;
    }

    if (this.pickMode === 'range') {
      // max range as days in milliseconds
      const maxRange = (this.service.opts.maxRange - 1) * 86400000;
      // if start not selected, set to this day
      if (this._date[0] === null) {
        this._date[0] = Object.assign({}, item);
        this.selectStart.emit(this._date[0]);
        // if end not selected, set to this day
      } else if (this._date[1] === null) {
        //  if start is before this day, set end to this day
        if (this._date[0].time < item.time) {
          this._date[1] = Object.assign({}, item);
          this.selectEnd.emit(this._date[1]);
          this.adjustStart(maxRange);
          // if start is after this day, set end to start, and start to this day
        } else {
          this._date[1] = this._date[0];
          this.selectEnd.emit(this._date[0]);
          this._date[0] = Object.assign({}, item);
          this.selectStart.emit(this._date[0]);
          this.adjustEnd(maxRange);
        }
        //  if start is after this day, set start to this day
      } else if (this._date[0].time > item.time) {
        this._date[0] = Object.assign({}, item);
        this.selectStart.emit(this._date[0]);
        this.adjustEnd(maxRange);
        // if end is before this day, set end to this day
      } else if (this._date[1].time < item.time) {
        this._date[1] = Object.assign({}, item);
        this.selectEnd.emit(this._date[1]);
        this.adjustStart(maxRange);
        //  else set end to null and start to this day
      } else {
        //  bump selected range to new range starting from selected to selected plus existing range
        const range = (this._date[1].time - this._date[0].time) / 86400000;
        this._date[0] = Object.assign({}, item);
        this.selectStart.emit(this._date[0]);
        let end = addDays(this._date[0].time, range);
        //  if end is after service.opts.to, set end to service.opts.to
        if (isAfter(end, this.service.opts.to)) end = startOfDay(this.service.opts.to);
        this._date[1].time = +end;
        this.selectEnd.emit(this._date[1]);
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


  // if max range and end minus max range is greater than start, set start to end minus max range
  private adjustStart(maxRange: number) {
    if (maxRange > 0 && this._date[1].time - maxRange > this._date[0].time) {
      this._date[0].time = +subDays(this._date[1].time, this.service.opts.maxRange - 1);
      this.selectStart.emit(this._date[0]);
    }
  }

  //  if max range and start plus max range is less than end, set end to start plus max range
  private adjustEnd(maxRange: number) {
    if (maxRange > 0 && this._date[0].time + maxRange < this._date[1].time) {
      this._date[1].time = +addDays(this._date[0].time, this.service.opts.maxRange - 1);
      this.selectEnd.emit(this._date[1]);
    }
  }
}
