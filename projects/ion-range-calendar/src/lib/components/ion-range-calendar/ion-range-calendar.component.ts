import {
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  Provider,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import {
  addMonths,
  addYears,
  format,
  parse,
  subMonths,
  subYears,
} from 'date-fns';

import {
  CalendarComponentMonthChange,
  CalendarComponentOptions,
  CalendarComponentPayloadTypes,
  CalendarComponentTypeProperty,
  CalendarDay,
  CalendarModalOptions,
  CalendarMonth,
  ControlValueType,
  RangeChange,
} from '../../calendar.types';

import { defaults } from '../../config';

import { IonRangeCalendarService } from '../../services/ion-range-calendar.service';

import { CalendarWeekComponent } from '../calendar-week/calendar-week.component';
import { MonthPickerComponent } from '../month-picker/month-picker.component';
import { MonthComponent } from '../month/month.component';

import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  caretDownOutline,
  caretUpOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

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

export type ionChange =
  | CalendarComponentPayloadTypes
  | { from?: CalendarComponentPayloadTypes; to?: CalendarComponentPayloadTypes }
  | CalendarComponentPayloadTypes[];

@Component({
  selector: 'ion-range-calendar',
  providers: [ION_CAL_VALUE_ACCESSOR, IonRangeCalendarService],
  styleUrls: ['ion-range-calendar.component.scss'],
  templateUrl: 'ion-range-calendar.component.html',
  imports: [
    CalendarWeekComponent,
    MonthComponent,
    FormsModule,
    MonthPickerComponent,
    IonButton,
    IonIcon,
  ],
})
export class IonRangeCalendarComponent implements ControlValueAccessor, OnInit {
  readonly format = input<string>(defaults.DATE_FORMAT);
  readonly type = input<CalendarComponentTypeProperty>('string');
  readonly readonly = input(false);

  options = input<CalendarComponentOptions, CalendarComponentOptions>(
    undefined,
    { transform: this.setOptions.bind(this) },
  );

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

  ionChange = output<ionChange>();
  monthChange = output<CalendarComponentMonthChange>();
  select = output<CalendarDay>();
  selectStart = output<CalendarDay>();
  selectEnd = output<CalendarDay>();

  readonly MONTH_DATE_FORMAT = 'MMMM yyyy';

  readonly calendarService = inject(IonRangeCalendarService);

  _onChanged!: (event: ControlValueType) => void;
  _onTouched!: (event: ControlValueType) => void;

  constructor() {
    this._compatibleIcons = {
      caretDown: 'caret-down-outline',
      caretUp: 'caret-up-outline',
      chevronBack: 'chevron-back-outline',
      chevronForward: 'chevron-forward-outline',
    };

    addIcons({
      caretDownOutline,
      caretUpOutline,
      chevronBackOutline,
      chevronForwardOutline,
    });
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
    if (new Date(this.monthOpt.original.time).getFullYear() === 1970) {
      return;
    }
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
      oldMonth: this.calendarService.multiFormat(this.monthOpt.original.time),
      newMonth: this.calendarService.multiFormat(nextTime),
    });
    this.monthOpt = this.createMonth(nextTime);
  }

  canNext(): boolean {
    if (!this._d.to || this._view !== 'days') {
      return true;
    }
    return this.monthOpt.original.time < new Date(this._d.to).valueOf();
  }

  backMonth(): void {
    const backTime = subMonths(this.monthOpt.original.time, 1).valueOf();
    this.monthChange.emit({
      oldMonth: this.calendarService.multiFormat(this.monthOpt.original.time),
      newMonth: this.calendarService.multiFormat(backTime),
    });
    this.monthOpt = this.createMonth(backTime);
  }

  canBack(): boolean {
    if (this._d.canBackwardsSelected) {
      return true;
    }
    if (!this._d.from || this._view !== 'days') {
      return true;
    }
    return this.monthOpt.original.time > new Date(this._d.from).valueOf();
  }

  monthOnSelect(month: number): void {
    this._view = 'days';
    const newMonth = new Date(this.monthOpt.original.time)
      .setMonth(month)
      .valueOf();
    this.monthChange.emit({
      oldMonth: this.calendarService.multiFormat(this.monthOpt.original.time),
      newMonth: this.calendarService.multiFormat(newMonth),
    });
    this.monthOpt = this.createMonth(newMonth);
  }

  onChanged($event: CalendarDay[]): void {
    switch (this._d.pickMode) {
      case 'single':
        return this.handleSingleChange($event[0]);
      case 'range':
        return this.handleRangeChange($event);
      case 'multi':
        return this.handleMultiChange($event);
    }
  }

  private handleSingleChange($event: CalendarDay): void {
    const date = this._handleType($event.time);
    this._onChanged(date);
    this.ionChange.emit(date);
  }

  private handleRangeChange($event: CalendarDay[]): void {
    if ($event[0] && $event[1]) {
      const rangeDate = {
        from: this._handleType($event[0].time),
        to: this._handleType($event[1].time),
      };
      this._onChanged(rangeDate);
      this.ionChange.emit(rangeDate);
    }
  }

  private handleMultiChange($event: CalendarDay[]): void {
    const dates: CalendarComponentPayloadTypes[] = [];

    for (const event of $event) {
      if (event && event.time) {
        dates.push(this._handleType(event.time));
      }
    }

    this._onChanged(dates);
    this.ionChange.emit(dates);
  }

  swipeEvent($event: Event): void {
    const isNext = ($event as WheelEvent).deltaX < 0;
    if (isNext && this.canNext()) {
      this.nextMonth();
    } else if (!isNext && this.canBack()) {
      this.backMonth();
    }
  }

  _payloadToTimeNumber(value: CalendarComponentPayloadTypes): number {
    let date: Date;
    if (typeof value === 'string') {
      date = parse(value, this.format(), new Date());
    } else if (typeof value === 'number' || value instanceof Date) {
      date = new Date(value);
    } else {
      date = new Date(
        value.years,
        value.months - 1,
        value.date,
        value.hours,
        value.minutes,
        value.seconds,
        value.milliseconds,
      );
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
    this._d = this.calendarService.safeOpt(this._options || {});
  }

  createMonth(date: number): CalendarMonth {
    return this.calendarService.createMonthsByPeriod(date, 1, this._d)[0];
  }

  _createCalendarDay(
    value?: CalendarComponentPayloadTypes | null,
  ): CalendarDay | null {
    if (!value) return null;
    return this.calendarService.createCalendarDay(
      this._payloadToTimeNumber(value),
      this._d,
    );
  }

  _handleType(value: number): CalendarComponentPayloadTypes {
    const date = new Date(value);
    switch (this.type()) {
      case 'string':
        return format(date, this.format());
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

  writeValue(obj: ControlValueType): void {
    this._writeValue(obj);
    if (obj) {
      if (this._calendarMonthValue[0]) {
        this.monthOpt = this.createMonth(this._calendarMonthValue[0].time);
      } else {
        this.monthOpt = this.createMonth(new Date().getTime());
      }
    }
  }

  registerOnChange(fn: (event: ControlValueType) => void): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: (event: ControlValueType) => void): void {
    this._onTouched = fn;
  }

  _writeValue(value: ControlValueType): void {
    if (!value) {
      this._calendarMonthValue = [null, null];
      return;
    }

    switch (this._d.pickMode) {
      case 'single':
        this._calendarMonthValue[0] = this._createCalendarDay(
          value as CalendarComponentPayloadTypes,
        );
        break;

      case 'range':
        this._calendarMonthValue[0] = this._createCalendarDay(
          (value as RangeChange).from,
        );
        this._calendarMonthValue[1] = this._createCalendarDay(
          (value as RangeChange).to,
        );
        break;

      case 'multi':
        if (Array.isArray(value)) {
          this._calendarMonthValue = value.map((e) =>
            this._createCalendarDay(e),
          );
        } else {
          this._calendarMonthValue = [null, null];
        }
        break;

      default:
        break;
    }
  }

  private setOptions(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
    if (this.monthOpt && this.monthOpt.original) {
      this.monthOpt = this.createMonth(this.monthOpt.original.time);
    }
    return value;
  }
}
