import { Inject, Injectable, Optional } from '@angular/core';

import { addDays, addMonths, format, getDaysInMonth, isAfter, isBefore, isSameDay, isToday, isWithinInterval, subDays } from 'date-fns';

import {
  CalendarOriginal,
  CalendarDay,
  CalendarMonth,
  CalendarModalOptions,
  CalendarResult,
  DayConfig,
} from '../calendar.model';

import { defaults } from '../config';

import { DEFAULT_CALENDAR_OPTIONS } from './calendar-options.provider';

@Injectable({ providedIn: 'root' })
export class IonRangeCalendarService {

  public opts: CalendarModalOptions;

  private readonly defaultOpts: CalendarModalOptions;

  constructor(
    @Optional()
    @Inject(DEFAULT_CALENDAR_OPTIONS)
    defaultOpts: CalendarModalOptions
  ) {
    this.defaultOpts = defaultOpts;
  }

  get DEFAULT_STEP() {
    return 12;
  }

  safeOpt(calendarOptions: Partial<CalendarModalOptions> = {}): CalendarModalOptions {
    const _disableWeeks: number[] = [];
    const _daysConfig: DayConfig[] = [];
    const {
      from = new Date(),
      to = 0,
      weekStart = 0,
      step = this.DEFAULT_STEP,
      id = '',
      cssClass = '',
      closeLabel = 'CANCEL',
      closeTitle = '',
      doneLabel = 'DONE',
      doneTitle = '',
      clearLabel = 'CLEAR',
      clearTitle = '',
      monthFormat = 'MMM yyyy',
      title = 'CALENDAR',
      defaultTitle = '',
      defaultSubtitle = '',
      autoDone = false,
      canBackwardsSelected = false,
      closeIcon = false,
      doneIcon = false,
      clearIcon = false,
      isSaveHistory = false,
      pickMode = 'single',
      color = defaults.COLOR,
      weekdays = defaults.WEEKS_FORMAT,
      daysConfig = _daysConfig,
      disableWeeks = _disableWeeks,
      showAdjacentMonthDay = true,
      defaultEndDateToStartDate = false,
      maxRange = 0,
    } = { ...this.defaultOpts, ...calendarOptions };

    if (calendarOptions.defaultDateRange) {
      //  if we have a default date range, and to and from
    }

    this.opts = {
      id,
      from,
      to,
      pickMode,
      autoDone,
      color,
      cssClass,
      weekStart,
      closeLabel,
      closeIcon,
      closeTitle,
      doneLabel,
      doneIcon,
      doneTitle,
      clearLabel,
      clearIcon,
      clearTitle,
      canBackwardsSelected,
      isSaveHistory,
      disableWeeks,
      monthFormat,
      title,
      weekdays,
      daysConfig,
      step,
      defaultTitle,
      defaultSubtitle,
      //  default scroll is either provided, inferred from the provided default date range from, the provided from, or today
      defaultScrollTo: calendarOptions.defaultScrollTo ||
        (calendarOptions.defaultDateRange ? new Date(calendarOptions.defaultDateRange.from) : null) ||
        new Date(from),
      defaultDate: calendarOptions.defaultDate || null,
      defaultDates: calendarOptions.defaultDates || null,
      defaultDateRange: calendarOptions.defaultDateRange || null,
      showAdjacentMonthDay,
      defaultEndDateToStartDate,
      maxRange,
    };
    return this.opts;
  }

  createOriginalCalendar(time: number): CalendarOriginal {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstWeek = new Date(year, month, 1).getDay();
    //  get the number of days in the month of the provided time
    const howManyDays = getDaysInMonth(date);
    return {
      year,
      month,
      firstWeek,
      howManyDays,
      time: new Date(year, month, 1).getTime(),
      date: new Date(time),
    };
  }

  findDayConfig(day: Date, opt: CalendarModalOptions): DayConfig | undefined {
    if (opt.daysConfig && opt.daysConfig.length <= 0) return null;
    return opt.daysConfig?.find(n => isSameDay(day, n.date));
  }

  createCalendarDay(time: number, opt: CalendarModalOptions, month?: number): CalendarDay {
    const _time = new Date(time);
    const date = new Date(time);
    const today = isToday(date);
    const dayConfig = this.findDayConfig(_time, opt);
    const _rangeBeg = new Date(opt.from).valueOf();
    const _rangeEnd = new Date(opt.to).valueOf();
    let isBetween = true;
    const disableWeeks = opt.disableWeeks && opt.disableWeeks.indexOf(_time.getDay()) !== -1;
    if (_rangeBeg > 0 && _rangeEnd > 0) {
      if (!opt.canBackwardsSelected) {
        isBetween = !isWithinInterval(_time, { start: _rangeBeg, end: _rangeEnd, });
      } else {
        isBetween = isBefore(_time, _rangeBeg) ? false : isBetween;
      }
    } else if (_rangeBeg > 0 && _rangeEnd === 0) {
      if (!opt.canBackwardsSelected) {
        const _addTime = addDays(_time, 1);
        isBetween = !isAfter(_addTime, _rangeBeg);
      } else {
        isBetween = false;
      }
    }

    let _disable = false;

    if (dayConfig && typeof dayConfig.disable === 'boolean') {
      _disable = dayConfig.disable;
    } else {
      _disable = disableWeeks || isBetween;
    }

    let title = new Date(time).getDate().toString();
    if (dayConfig && dayConfig.title) {
      title = dayConfig.title;
    } else if (opt.defaultTitle) {
      title = opt.defaultTitle;
    }
    let subTitle = '';
    if (dayConfig && dayConfig.subTitle) {
      subTitle = dayConfig.subTitle;
    } else if (opt.defaultSubtitle) {
      subTitle = opt.defaultSubtitle;
    }

    return {
      time,
      isToday: today,
      title,
      subTitle,
      isLastMonth: typeof month === 'number' ? date.getMonth() < month : false,
      isNextMonth: typeof month === 'number' ? date.getMonth() > month : false,
      marked: dayConfig ? dayConfig.marked || false : false,
      cssClass: dayConfig ? dayConfig.cssClass || '' : '',
      disable: _disable,
      isFirst: date.getDate() === 1,
      isLast: date.getDate() === getDaysInMonth(date),
    };
  }

  createCalendarMonth(original: CalendarOriginal, opt: CalendarModalOptions): CalendarMonth {
    const days: Array<CalendarDay> = new Array(6).fill(null);
    const len = original.howManyDays;
    for (let i = original.firstWeek; i < len + original.firstWeek; i++) {
      const itemTime = new Date(original.year, original.month, i - original.firstWeek + 1).getTime();
      days[i] = this.createCalendarDay(itemTime, opt);
    }

    const weekStart = opt.weekStart;

    if (weekStart === 1) {
      if (days[0] === null) {
        days.shift();
      } else {
        days.unshift(...new Array(6).fill(null));
      }
    }

    if (opt.showAdjacentMonthDay) {
      const _booleanMap = days.map(e => !!e);
      const thisMonth = new Date(original.time).getMonth();
      let startOffsetIndex = _booleanMap.indexOf(true) - 1;
      let endOffsetIndex = _booleanMap.lastIndexOf(true) + 1;
      for (startOffsetIndex; startOffsetIndex >= 0; startOffsetIndex--) {
        const dayBefore = subDays(days[startOffsetIndex + 1].time, 1);
        days[startOffsetIndex] = this.createCalendarDay(dayBefore.valueOf(), opt, thisMonth);
      }

      if (!(_booleanMap.length % 7 === 0 && _booleanMap[_booleanMap.length - 1])) {
        for (endOffsetIndex; endOffsetIndex < days.length + (endOffsetIndex % 7); endOffsetIndex++) {
          const dayAfter = addDays(days[endOffsetIndex - 1].time, 1);
          days[endOffsetIndex] = this.createCalendarDay(dayAfter.valueOf(), opt, thisMonth);
        }
      }
    }

    return {
      days,
      original: original,
    };
  }

  createMonthsByPeriod(startTime: number, monthsNum: number, opt: CalendarModalOptions): Array<CalendarMonth> {
    const _array: Array<CalendarMonth> = [];

    const _start = new Date(startTime);
    const _startMonth = new Date(_start.getFullYear(), _start.getMonth(), 1).getTime();

    for (let i = 0; i < monthsNum; i++) {
      const time = addMonths(_startMonth, i).valueOf();
      const originalCalendar = this.createOriginalCalendar(time);
      _array.push(this.createCalendarMonth(originalCalendar, opt));
    }

    return _array;
  }

  wrapResult(original: CalendarDay[], pickMode: string) {
    let result: CalendarResult[] | CalendarResult | { from: CalendarResult; to: CalendarResult } | CalendarDay[];
    switch (pickMode) {
      case 'single':
        result = this.multiFormat(original[0].time);
        break;
      case 'range':
        result = {
          from: this.multiFormat(original[0].time),
          to: this.multiFormat((original[1] || original[0]).time),
        };
        break;
      case 'multi':
        result = original.map(e => this.multiFormat(e.time));
        break;
      default:
        result = original;
    }
    return result;
  }

  multiFormat(time: number): CalendarResult {
    const _date = new Date(time);
    return {
      time: _date.valueOf(),
      unix: Math.floor(_date.valueOf() / 1000),
      dateObj: _date,
      string: format(_date, defaults.DATE_FORMAT),
      years: _date.getFullYear(),
      months: _date.getMonth() + 1,
      date: _date.getDate(),
    };
  }
}
