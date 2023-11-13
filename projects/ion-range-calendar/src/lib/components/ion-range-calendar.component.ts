import { Component, EventEmitter, forwardRef, Input, OnInit, Output, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { addMonths, addYears, format, parse, subMonths, subYears } from 'date-fns';

import {
  CalendarComponentMonthChange,
  CalendarComponentOptions,
  CalendarComponentPayloadTypes,
  CalendarComponentTypeProperty,
  CalendarDay,
  CalendarModalOptions,
  CalendarMonth
} from '../calendar.model';

import { defaults } from '../config';

import { IonRangeCalendarService } from '../services/ion-range-calendar.service';

export const ION_CAL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IonRangeCalendarComponent),
  multi: true,
};

interface CompatibleIcons {
  caretDown: string;
  caretUp: string;
  chevronBack: string;
  chevronForward: string;
}

export type CalendarChange =
  | CalendarComponentPayloadTypes
  | { from: CalendarComponentPayloadTypes, to: CalendarComponentPayloadTypes }
  | CalendarComponentPayloadTypes[];

@Component({
  selector: 'ion-range-calendar',
  providers: [ION_CAL_VALUE_ACCESSOR],
  styleUrls: ['ion-range-calendar.component.scss'],
  templateUrl: 'ion-range-calendar.component.html',
})
export class IonRangeCalendarComponent implements ControlValueAccessor, OnInit {
  _d: CalendarModalOptions;
  _options: CalendarComponentOptions;
  _view: 'month' | 'days' = 'days';
  _calendarMonthValue: CalendarDay[] = [null, null];
  _showToggleButtons = true;
  _compatibleIcons: CompatibleIcons;

  get showToggleButtons(): boolean {
    return this._showToggleButtons;
  }

  set showToggleButtons(value: boolean) {
    this._showToggleButtons = value;
  }

  _showMonthPicker = true;
  get showMonthPicker(): boolean {
    return this._showMonthPicker;
  }

  set showMonthPicker(value: boolean) {
    this._showMonthPicker = value;
  }

  monthOpt: CalendarMonth;

  @Input() format: string = defaults.DATE_FORMAT;
  @Input() type: CalendarComponentTypeProperty = 'string';
  @Input() readonly = false;
  @Output() change: EventEmitter<CalendarChange> = new EventEmitter();
  @Output() monthChange: EventEmitter<CalendarComponentMonthChange> = new EventEmitter();
  @Output() select: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() selectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() selectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  @Input()
  set options(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
    if (this.monthOpt && this.monthOpt.original) {
      this.monthOpt = this.createMonth(this.monthOpt.original.time);
    }
  }

  get options(): CalendarComponentOptions {
    return this._options;
  }

  readonly MONTH_DATE_FORMAT = 'MMMM yyyy';

  constructor(
    public calSvc: IonRangeCalendarService
  ) {
    this._compatibleIcons = {
      caretDown: 'caret-down-outline',
      caretUp: 'caret-up-outline',
      chevronBack: 'chevron-back-outline',
      chevronForward: 'chevron-forward-outline',
    };
  }

  ngOnInit(): void {
    this.initOpt();
    this.monthOpt = this.createMonth(new Date().getTime());
  }

  getViewDate() {
    return this._handleType(this.monthOpt.original.time);
  }

  getDate(date: number) {
    return new Date(date);
  }

  setViewDate(value: CalendarComponentPayloadTypes) {
    this.monthOpt = this.createMonth(this._payloadToTimeNumber(value));
  }

  switchView(): void {
    this._view = this._view === 'days' ? 'month' : 'days';
  }

  prev(): void {
    if (this._view === 'days') {
      this.backMonth();
    } else {
      this.prevYear();
    }
  }

  next(): void {
    if (this._view === 'days') {
      this.nextMonth();
    } else {
      this.nextYear();
    }
  }

  prevYear(): void {
    if (new Date(this.monthOpt.original.time).getFullYear() === 1970) { return; }
    const backTime = subYears(this.monthOpt.original.time, 1).valueOf();
    this.monthOpt = this.createMonth(backTime);
  }

  nextYear(): void {
    const nextTime = addYears(this.monthOpt.original.time, 1).valueOf();
    this.monthOpt = this.createMonth(nextTime);
  }

  nextMonth(): void {
    const nextTime = addMonths(this.monthOpt.original.time, 1).valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(nextTime),
    });
    this.monthOpt = this.createMonth(nextTime);
  }

  canNext(): boolean {
    if (!this._d.to || this._view !== 'days') { return true; }
    return this.monthOpt.original.time < new Date(this._d.to).valueOf();
  }

  backMonth(): void {
    const backTime = subMonths(this.monthOpt.original.time, 1).valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(backTime),
    });
    this.monthOpt = this.createMonth(backTime);
  }

  canBack(): boolean {
    if (!this._d.from || this._view !== 'days') { return true; }
    return this.monthOpt.original.time > new Date(this._d.from).valueOf();
  }

  monthOnSelect(month: number): void {
    this._view = 'days';
    const newMonth = new Date(this.monthOpt.original.time).setMonth(month).valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(newMonth),
    });
    this.monthOpt = this.createMonth(newMonth);
  }

  onChanged($event: CalendarDay[]): void {
    switch (this._d.pickMode) {
      case 'single':
        const date = this._handleType($event[0].time);
        this._onChanged(date);
        this.change.emit(date);
        break;

      case 'range':
        if ($event[0] && $event[1]) {
          const rangeDate = {
            from: this._handleType($event[0].time),
            to: this._handleType($event[1].time),
          };
          this._onChanged(rangeDate);
          this.change.emit(rangeDate);
        }
        break;

      case 'multi':
        const dates = [];

        for (let i = 0; i < $event.length; i++) {
          if ($event[i] && $event[i].time) {
            dates.push(this._handleType($event[i].time));
          }
        }

        this._onChanged(dates);
        this.change.emit(dates);
        break;

      default:
    }
  }

  swipeEvent($event: any): void {
    const isNext = $event.deltaX < 0;
    if (isNext && this.canNext()) {
      this.nextMonth();
    } else if (!isNext && this.canBack()) {
      this.backMonth();
    }
  }

  _onChanged: Function = () => { };

  _onTouched: Function = () => { };

  _payloadToTimeNumber(value: CalendarComponentPayloadTypes): number {
    let date: Date;
    if (typeof value === 'string') {
      date = parse(value, this.format, new Date());
    } else if (typeof value === 'number' || value instanceof Date) {
      date = new Date(value);
    } else {
      date = new Date(value.years, value.months - 1, value.date, value.hours, value.minutes, value.seconds, value.milliseconds);
    }
    return date.valueOf();
  }

  _monthFormat(date: number): string {
    return format(date, this._d.monthFormat);
  }

  private initOpt(): void {
    if (this._options && typeof this._options.showToggleButtons === 'boolean') {
      this.showToggleButtons = this._options.showToggleButtons;
    }
    if (this._options && typeof this._options.showMonthPicker === 'boolean') {
      this.showMonthPicker = this._options.showMonthPicker;
      if (this._view !== 'days' && !this.showMonthPicker) {
        this._view = 'days';
      }
    }
    this._d = this.calSvc.safeOpt(this._options || {});
  }

  createMonth(date: number): CalendarMonth {
    return this.calSvc.createMonthsByPeriod(date, 1, this._d)[0];
  }

  _createCalendarDay(value: CalendarComponentPayloadTypes): CalendarDay {
    return this.calSvc.createCalendarDay(this._payloadToTimeNumber(value), this._d);
  }

  _handleType(value: number): CalendarComponentPayloadTypes {
    const date = new Date(value);
    switch (this.type) {
      case 'string':
        return format(date, this.format);
      case 'js-date':
        return date;
      case 'time':
        return date.valueOf();
      case 'object':
        return {
          years: date.getFullYear(),
          months: date.getMonth() + 1,
          date: date.getDate(),
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds(),
          milliseconds: date.getMilliseconds(),
        };
      default:
        return date;
    }
  }

  writeValue(obj: any): void {
    this._writeValue(obj);
    if (obj) {
      if (this._calendarMonthValue[0]) {
        this.monthOpt = this.createMonth(this._calendarMonthValue[0].time);
      } else {
        this.monthOpt = this.createMonth(new Date().getTime());
      }
    }
  }

  registerOnChange(fn: () => {}): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  _writeValue(value: any): void {
    if (!value) {
      this._calendarMonthValue = [null, null];
      return;
    }

    switch (this._d.pickMode) {
      case 'single':
        this._calendarMonthValue[0] = this._createCalendarDay(value);
        break;

      case 'range':
        if (value.from) {
          this._calendarMonthValue[0] = value.from ? this._createCalendarDay(value.from) : null;
        }
        if (value.to) {
          this._calendarMonthValue[1] = value.to ? this._createCalendarDay(value.to) : null;
        }
        break;

      case 'multi':
        if (Array.isArray(value)) {
          this._calendarMonthValue = value.map(e => {
            return this._createCalendarDay(e);
          });
        } else {
          this._calendarMonthValue = [null, null];
        }
        break;

      default:
    }
  }
}
