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
  /**
   * The date to be configured.
   */
  date: Date;
  /**
   * Increase the font weight of the day number.
   * @default false
   */
  marked?: boolean;
  /**
   * Disable the day.
   * @default false
   */
  disable?: boolean;
  /**
   * Customise the day number.
   */
  title?: string;
  /**
   * Add a subtitle to the day.
   */
  subTitle?: string;
  /**
   * Add a custom class to the day.
   */
  cssClass?: string;
}

export interface ModalOptions {
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface CalendarOptions {
  /**
   * The start date of the selectable range of dates.
   */
  from?: Date | number;
  /**
   * The end date of the selectable range of dates.
   */
  to?: Date | number;
  /**
   * The mode of the calendar.
   * - `single`: Select a single date.
   * - `multi`: Select multiple dates.
   * - `range`: Select a range of dates.
   **/
  pickMode?: PickMode;
  /**
   * The day of the week that the calendar starts on.
   * - `0`: Sunday
   * - `1`: Monday
   */
  weekStart?: number;
  /**
   * Weeks to be disabled.
   */
  disableWeeks?: number[];
  /**
   * The name of the weekdays headers.
   * @default ['S','M','T','W','T','F','S']
   */
  weekdays?: string[];
  /**
   * The `date-fns` format of the month header.
   * @default 'MMM yyyy'
   */
  monthFormat?: string;
  color?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  /**
   * Per day options, apply changes to specific days.
   */
  daysConfig?: DayConfig[];
  /**
   * show last month & next month days fill six weeks
   */
  showAdjacentMonthDay?: boolean;
}

export interface CalendarModalOptions extends CalendarOptions {
  /**
   * Automatically close the calendar when a date is selected.
   *
   * Does not apply to `pickMode: 'multi'`.
   */
  autoDone?: boolean;
  /**
   * Additional CSS classes to apply to the calendar modal.
   * @default ''
   */
  cssClass?: string;
  /**
   * The label text for the close button.
   * @default 'Cancel'
   */
  closeLabel?: string;
  /**
   * The label text for the done button.
   * @default 'Done'
   */
  doneLabel?: string;
  /**
   * The label text for the clear button.
   * @default 'Clear'
   */
  clearLabel?: string;
  /**
   * Whether to show the close button icon.
   * @default false
   */
  closeIcon?: boolean;
  /**
   * Whether to show the done button icon.
   * @default false
   */
  doneIcon?: boolean;
  /**
   * Whether to show the clear button icon.
   * @default false
   */
  clearIcon?: boolean;
  /**
   * The title of the close button.
   * @default 'Cancel'
   */
  closeTitle?: string;
  /**
   * The title of the done button.
   * @default 'Done'
   */
  doneTitle?: string;
  /**
   * The title of the clear button.
   * @default 'Clear'
   */
  clearTitle?: string;
  /**
   * Ignore the `from` date when restricting the selectable range of dates.
   *
   * Allows the user to select any date before the `to` date.
   * @default false
   */
  canBackwardsSelected?: boolean;
  /**
   * The title of the calendar modal.
   */
  title?: string;
  /**
   * The date to scroll to when the calendar is opened.
   */
  defaultScrollTo?: Date;

  /**
   * The date to be selected when the calendar is opened.
   *
   * This is used when the `pickMode` is set to `single`.
   */
  initialDate?: DefaultDate;
  /**
   * The dates to be selected when the calendar is opened.
   *
   * This is used when the `pickMode` is set to `multi`.
   */
  initialDates?: DefaultDate[];
  /**
   * The date range to be selected when the calendar is opened.
   *
   * This is used when the `pickMode` is set to `range`.
   */
  initialDateRange?: { from: DefaultDate; to?: DefaultDate } | null;

  /**
   * The date to be selected when the calendar is reset.
   *
   * This is used when the `pickMode` is set to `single`.
   */
  defaultDate?: DefaultDate;
  /**
   * The dates to be selected when the calendar is reset.
   *
   * This is used when the `pickMode` is set to `multi`.
   */
  defaultDates?: DefaultDate[];
  /**
   * The date range to be selected when the calendar is reset.
   *
   * This is used when the `pickMode` is set to `range`.
   */
  defaultDateRange?: { from: DefaultDate; to?: DefaultDate } | null;

  step?: number;
  defaultEndDateToStartDate?: boolean;
  /**
   * The maximum length of the range in days.
   * - only applies to `pickMode: 'range'`
   * @default 0
   */
  maxRange?: number;
  /**
   * Swap the clear button with a reset button
   * - Changes the default clear label to "Reset"
   * - Changes the default clear icon to "refresh"
   * - Changes the default clear title to "Reset"
   * - Reverts the selected date/dates/range to the default date/dates/range
   *
   * @default false
   */
  clearResetsToDefault?: boolean;
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
export type Colors =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'light'
  | 'dark'
  | string;
export type PickMode = 'multi' | 'single' | 'range';
export type CalendarComponentTypeProperty =
  | 'string'
  | 'js-date'
  | 'time'
  | 'object';
export type CalendarComponentPayloadTypes =
  | string
  | Date
  | number
  | {
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

export type ControlValueType =
  | CalendarComponentPayloadTypes
  | CalendarComponentPayloadTypes[]
  | RangeChange;
