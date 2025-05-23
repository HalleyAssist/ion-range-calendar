import { inject, Injectable } from '@angular/core';

import {
  addDays,
  addMonths,
  format,
  getDaysInMonth,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isWithinInterval,
  subDays,
} from 'date-fns';

import {
  CalendarDay,
  CalendarModalOptions,
  CalendarMonth,
  CalendarOriginal,
  CalendarResult,
  DayConfig,
} from '../calendar.types';

import { defaults } from '../config';

import { DEFAULT_CALENDAR_OPTIONS } from './calendar-options.provider';

@Injectable({ providedIn: 'root' })
export class IonRangeCalendarService {
  public opts: CalendarModalOptions;

  private readonly defaultOpts = inject(DEFAULT_CALENDAR_OPTIONS, {
    optional: true,
  });

  readonly DEFAULT_STEP = 12;

  safeOpt(
    calendarOptions: Partial<CalendarModalOptions> = {},
  ): CalendarModalOptions {
    const _disableWeeks: number[] = [];
    const _daysConfig: DayConfig[] = [];
    let {
      from = this.defaultOpts?.from || calendarOptions.from || new Date(),
      to = 0,
      weekStart = 0,
      step = this.DEFAULT_STEP,
      cssClass = '',
      closeLabel = 'Cancel',
      closeTitle = '',
      doneLabel = 'Done',
      doneTitle = '',
      clearLabel = 'Clear',
      clearTitle = '',
      monthFormat = 'MMM yyyy',
      title = 'Calendar',
      defaultTitle = '',
      defaultSubtitle = '',
      autoDone = false,
      canBackwardsSelected = false,
      closeIcon = false,
      doneIcon = false,
      clearIcon = false,
      pickMode = 'single',
      color = defaults.COLOR,
      weekdays = defaults.WEEKS_FORMAT,
      daysConfig = _daysConfig,
      disableWeeks = _disableWeeks,
      showAdjacentMonthDay = true,
      defaultEndDateToStartDate = true,
      maxRange = 0,
      clearResetsToDefault = false,
    } = { ...this.defaultOpts, ...calendarOptions };

    //  if from is not provided, but a default range is, set from to the default range from
    if (
      typeof calendarOptions.from === 'undefined' &&
      calendarOptions.defaultDateRange
    ) {
      from = subDays(new Date(calendarOptions.defaultDateRange.from), 1);
    }

    //  default scroll is either provided, inferred from the provided default date range from, the provided from, or today
    let defaultScrollTo = calendarOptions.defaultScrollTo;
    if (!defaultScrollTo) {
      if (calendarOptions.defaultDateRange) {
        defaultScrollTo = new Date(calendarOptions.defaultDateRange.from);
      } else {
        defaultScrollTo = from ? new Date(from) : new Date();
      }
    }

    if (
      clearResetsToDefault &&
      !this.defaultOpts?.clearLabel &&
      !calendarOptions.clearLabel
    ) {
      clearLabel = 'Reset';
    }

    this.opts = {
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
      disableWeeks,
      monthFormat,
      title,
      weekdays,
      daysConfig,
      step,
      defaultTitle,
      defaultSubtitle,
      defaultScrollTo,
      initialDate:
        calendarOptions.initialDate || calendarOptions.defaultDate || null,
      initialDates:
        calendarOptions.initialDates || calendarOptions.defaultDates || null,
      initialDateRange:
        calendarOptions.initialDateRange ||
        calendarOptions.defaultDateRange ||
        null,
      defaultDate: calendarOptions.defaultDate || null,
      defaultDates: calendarOptions.defaultDates || null,
      defaultDateRange: calendarOptions.defaultDateRange || null,
      showAdjacentMonthDay,
      defaultEndDateToStartDate,
      maxRange,
      clearResetsToDefault,
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
    return opt.daysConfig?.find((n) => isSameDay(day, n.date));
  }

  createCalendarDay(
    time: number,
    opt: CalendarModalOptions,
    month?: number,
  ): CalendarDay {
    const _time = new Date(time);
    const date = new Date(time);
    const today = isToday(date);
    const dayConfig = this.findDayConfig(_time, opt);
    const _rangeBeg = new Date(opt.from);
    const _rangeEnd = new Date(opt.to);
    const _hasBeg = !!_rangeBeg.valueOf();
    const _hasEnd = !!_rangeEnd.valueOf();
    let isInRange = true;
    const disableWeeks =
      opt.disableWeeks && opt.disableWeeks.indexOf(_time.getDay()) !== -1;

    if (_hasBeg && _hasEnd) {
      //  both from and to are set, check if time is in between, unless backwards selection is allowed, then check if time is before to
      if (opt.canBackwardsSelected) {
        isInRange = isBefore(_time, _rangeEnd);
      } else {
        isInRange = isWithinInterval(_time, {
          start: _rangeBeg,
          end: _rangeEnd,
        });
      }
    } else if (_hasBeg && !_hasEnd && !opt.canBackwardsSelected) {
      // if only from is set, check if time is after from, unless backwards selection is allowed
      isInRange = isAfter(_time, _rangeBeg);
    } else if (!_hasBeg && _hasEnd) {
      // if only to is set, check if time is before to
      isInRange = isBefore(_time, _rangeEnd);
    }
    //  if both from and to are not set, then all days are in range

    let _disable = false;

    if (dayConfig && typeof dayConfig.disable === 'boolean') {
      _disable = dayConfig.disable;
    } else {
      _disable = disableWeeks || !isInRange;
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

  createCalendarMonth(
    original: CalendarOriginal,
    opt: CalendarModalOptions,
  ): CalendarMonth {
    const days: CalendarDay[] = new Array(6).fill(null);
    const len = original.howManyDays;
    for (let i = original.firstWeek; i < len + original.firstWeek; i++) {
      const itemTime = new Date(
        original.year,
        original.month,
        i - original.firstWeek + 1,
      ).getTime();
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
      const _booleanMap = days.map((e) => !!e);
      const thisMonth = new Date(original.time).getMonth();
      let startOffsetIndex = _booleanMap.indexOf(true) - 1;
      let endOffsetIndex = _booleanMap.lastIndexOf(true) + 1;
      for (startOffsetIndex; startOffsetIndex >= 0; startOffsetIndex--) {
        const dayBefore = subDays(days[startOffsetIndex + 1].time, 1);
        days[startOffsetIndex] = this.createCalendarDay(
          dayBefore.valueOf(),
          opt,
          thisMonth,
        );
      }

      if (
        !(_booleanMap.length % 7 === 0 && _booleanMap[_booleanMap.length - 1])
      ) {
        for (
          endOffsetIndex;
          endOffsetIndex < days.length + (endOffsetIndex % 7);
          endOffsetIndex++
        ) {
          const dayAfter = addDays(days[endOffsetIndex - 1].time, 1);
          days[endOffsetIndex] = this.createCalendarDay(
            dayAfter.valueOf(),
            opt,
            thisMonth,
          );
        }
      }
    }

    return {
      days,
      original: original,
    };
  }

  createMonthsByPeriod(
    startTime: number,
    monthsNum: number,
    opt: CalendarModalOptions,
  ): CalendarMonth[] {
    const _array: CalendarMonth[] = [];

    const _start = new Date(startTime);
    const _startMonth = new Date(
      _start.getFullYear(),
      _start.getMonth(),
      1,
    ).getTime();

    for (let i = 0; i < monthsNum; i++) {
      const time = addMonths(_startMonth, i).valueOf();
      const originalCalendar = this.createOriginalCalendar(time);
      _array.push(this.createCalendarMonth(originalCalendar, opt));
    }

    return _array;
  }

  wrapResult(original: CalendarDay[], pickMode: string) {
    let result:
      | CalendarResult[]
      | CalendarResult
      | { from: CalendarResult; to: CalendarResult }
      | CalendarDay[];
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
        result = original.map((e) => this.multiFormat(e.time));
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
