import { AnimationBuilder } from '@ionic/core';

export interface CalendarOriginal {
  time: number;
  date: Date;
  year: number;
  month: number;
  firstWeek: number;
  howManyDays: number;
}

export interface CalendarDay {
  time: number;
  isToday: boolean;
  disable: boolean;
  cssClass: string;
  isLastMonth?: boolean;
  isNextMonth?: boolean;
  title?: string;
  subTitle?: string;
  marked?: boolean;
  style?: {
    title?: string;
    subTitle?: string;
  };
  isFirst?: boolean;
  isLast?: boolean;
}

export interface CalendarMonth {
  original: CalendarOriginal;
  days: CalendarDay[];
}

export interface DayConfig {
  date: Date;
  marked?: boolean;
  disable?: boolean;
  title?: string;
  subTitle?: string;
  cssClass?: string;
}

export interface ModalOptions {
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface CalendarOptions {
  from?: Date | number;
  to?: Date | number;
  pickMode?: PickMode;
  weekStart?: number;
  disableWeeks?: number[];
  weekdays?: string[];
  monthFormat?: string;
  color?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  daysConfig?: DayConfig[];
  /**
   * show last month & next month days fill six weeks
   */
  showAdjacentMonthDay?: boolean;
}

export interface CalendarModalOptions extends CalendarOptions {
  autoDone?: boolean;
  format?: string;
  cssClass?: string;
  isSaveHistory?: boolean;
  closeLabel?: string;
  doneLabel?: string;
  clearLabel?: string;
  closeIcon?: boolean;
  doneIcon?: boolean;
  clearIcon?: boolean;
  closeTitle?: string;
  doneTitle?: string;
  clearTitle?: string;
  canBackwardsSelected?: boolean;
  title?: string;
  defaultScrollTo?: Date;
  defaultDate?: DefaultDate;
  defaultDates?: DefaultDate[];
  defaultDateRange?: { from: DefaultDate; to?: DefaultDate } | null;
  step?: number;
  defaultEndDateToStartDate?: boolean;
  maxRange?: number;
}

export interface CalendarComponentOptions extends CalendarOptions {
  showToggleButtons?: boolean;
  showMonthPicker?: boolean;
  monthPickerFormat?: string[];
}

export interface CalendarResult {
  time: number;
  unix: number;
  dateObj: Date;
  string: string;
  years: number;
  months: number;
  date: number;
}

export interface CalendarComponentMonthChange {
  oldMonth: CalendarResult;
  newMonth: CalendarResult;
}

export type DefaultDate = Date | string | number | null;
export type Colors = 'primary' | 'secondary' | 'danger' | 'light' | 'dark' | string;
export type PickMode = 'multi' | 'single' | 'range';
export type CalendarComponentTypeProperty = 'string' | 'js-date' | 'time' | 'object';
export type CalendarComponentPayloadTypes = string | Date | number | {
  years: number;
  months: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export interface RangeChange {
  from: CalendarComponentPayloadTypes;
  to: CalendarComponentPayloadTypes;
}

export type ControlValueType = CalendarComponentPayloadTypes | CalendarComponentPayloadTypes[] | RangeChange;
