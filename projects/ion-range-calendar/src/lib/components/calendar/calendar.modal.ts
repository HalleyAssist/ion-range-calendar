import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  Renderer2,
  input,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import {
  IonContentCustomEvent,
  IonInfiniteScrollCustomEvent,
  ScrollDetail,
} from '@ionic/core';
import { addIcons } from 'ionicons';
import { checkmark, close, refresh } from 'ionicons/icons';

import {
  CalendarDay,
  CalendarModalOptions,
  CalendarMonth,
  DefaultDate,
} from '../../calendar.types';

import { IonRangeCalendarService } from '../../services/ion-range-calendar.service';

import {
  addMonths,
  differenceInMonths,
  format,
  isAfter,
  startOfDay,
  subMonths,
} from 'date-fns';

import { CalendarWeekComponent } from '../calendar-week/calendar-week.component';
import { MonthComponent } from '../month/month.component';

const NUM_OF_MONTHS_TO_CREATE = 3;

@Component({
  selector: 'ion-range-calendar-modal',
  styleUrls: ['./calendar.modal.scss'],
  templateUrl: 'calendar.modal.html',
  imports: [
    CalendarWeekComponent,
    NgClass,
    MonthComponent,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonLabel,
    IonIcon,
    IonTitle,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  providers: [IonRangeCalendarService],
})
export class CalendarModalComponent implements OnInit, AfterViewInit {
  readonly options = input<CalendarModalOptions>({});

  readonly content = viewChild(IonContent);
  readonly monthsEle = viewChild<ElementRef>('months');

  @HostBinding('class.ion-page') ionPage = true;

  datesTemp: CalendarDay[] = [null, null];
  calendarMonths: CalendarMonth[];
  step: number;
  showYearPicker: boolean;
  year: number;
  years: number[];
  _scrollLock = true;
  _d: CalendarModalOptions;
  actualFirstTime: number;

  constructor(
    private _renderer: Renderer2,
    public _elementRef: ElementRef,
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public calSvc: IonRangeCalendarService,
  ) {
    addIcons({
      close,
      refresh,
      checkmark,
    });
  }

  ngOnInit(): void {
    this.init();
    this.initDefaultDate();
  }

  ngAfterViewInit(): void {
    this.findCssClass();
    if (this._d.canBackwardsSelected) this.backwardsMonth();
    this.scrollToDefaultDate();
  }

  init(): void {
    this._d = this.calSvc.safeOpt(this.options());
    this._d.showAdjacentMonthDay = false;
    this.step = this._d.step;
    if (this.step < this.calSvc.DEFAULT_STEP) {
      this.step = this.calSvc.DEFAULT_STEP;
    }

    this.calendarMonths = this.calSvc.createMonthsByPeriod(
      new Date(this._d.defaultScrollTo || this._d.from).valueOf(),
      this.step,
      this._d,
    );
  }

  initDefaultDate(): void {
    const { pickMode, defaultDate, defaultDateRange, defaultDates } = this._d;
    switch (pickMode) {
      case 'single':
        if (defaultDate) {
          this.datesTemp[0] = this.calSvc.createCalendarDay(
            this._getDayTime(defaultDate),
            this._d,
          );
        }
        break;
      case 'range':
        if (defaultDateRange) {
          if (defaultDateRange.from) {
            this.datesTemp[0] = this.calSvc.createCalendarDay(
              this._getDayTime(defaultDateRange.from),
              this._d,
            );
          }
          if (defaultDateRange.to) {
            this.datesTemp[1] = this.calSvc.createCalendarDay(
              this._getDayTime(defaultDateRange.to),
              this._d,
            );
          }
        }
        break;
      case 'multi':
        if (defaultDates && defaultDates.length) {
          this.datesTemp = defaultDates.map((e) =>
            this.calSvc.createCalendarDay(this._getDayTime(e), this._d),
          );
        }
        break;
      default:
        this.datesTemp = [null, null];
    }
  }

  findCssClass(): void {
    const { cssClass } = this._d;
    if (cssClass) {
      cssClass.split(' ').forEach((_class: string) => {
        if (_class.trim() !== '')
          this._renderer.addClass(this._elementRef.nativeElement, _class);
      });
    }
  }

  onChange(data: CalendarDay[]): void {
    const { pickMode, autoDone } = this._d;

    this.datesTemp = data;
    this.ref.detectChanges();

    if (pickMode !== 'multi' && autoDone && this.canDone()) {
      this.done();
    }

    this.repaintDOM();
  }

  onCancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  done(): void {
    const { pickMode } = this._d;

    this.modalCtrl.dismiss(
      this.calSvc.wrapResult(this.datesTemp, pickMode),
      'done',
    );
  }

  canDone(): boolean {
    if (!Array.isArray(this.datesTemp)) {
      return false;
    }
    const { pickMode, defaultEndDateToStartDate } = this._d;

    switch (pickMode) {
      case 'single':
        return !!(this.datesTemp[0] && this.datesTemp[0].time);
      case 'range':
        if (defaultEndDateToStartDate) {
          return !!(this.datesTemp[0] && this.datesTemp[0].time);
        }
        return (
          !!(this.datesTemp[0] && this.datesTemp[1]) &&
          !!(this.datesTemp[0].time && this.datesTemp[1].time)
        );
      case 'multi':
        return (
          this.datesTemp.length > 0 &&
          this.datesTemp.every((e) => !!e && !!e.time)
        );
      default:
        return false;
    }
  }

  clear() {
    if (this._d.clearResetsToDefault) {
      this.initDefaultDate();
    } else {
      this.datesTemp = [null, null];
    }
    this.ref.detectChanges();
  }

  canClear() {
    return !!this.datesTemp[0];
  }

  nextMonth(event: IonInfiniteScrollCustomEvent<void>): void {
    const len = this.calendarMonths.length;
    const final = this.calendarMonths[len - 1];
    const nextTime = addMonths(final.original.time, 1).valueOf();
    const rangeEnd = this._d.to ? subMonths(this._d.to, 1) : 0;

    if (
      len <= 0 ||
      (rangeEnd !== 0 && isAfter(final.original.time, rangeEnd))
    ) {
      event.target.disabled = true;
      return;
    }

    this.calendarMonths.push(
      ...this.calSvc.createMonthsByPeriod(
        nextTime,
        NUM_OF_MONTHS_TO_CREATE,
        this._d,
      ),
    );
    event.target.complete();
    this.repaintDOM();
  }

  backwardsMonth(): void {
    const first = this.calendarMonths[0];

    if (first.original.time <= 0) {
      this._d.canBackwardsSelected = false;
      return;
    }

    const firstTime = (this.actualFirstTime = subMonths(
      first.original.time,
      NUM_OF_MONTHS_TO_CREATE,
    ).valueOf());

    this.calendarMonths.unshift(
      ...this.calSvc.createMonthsByPeriod(
        firstTime,
        NUM_OF_MONTHS_TO_CREATE,
        this._d,
      ),
    );
    this.ref.detectChanges();
    this.repaintDOM();
  }

  scrollToDate(date: Date): void {
    const defaultDateIndex = this.findInitMonthNumber(date);
    const monthElement =
      this.monthsEle().nativeElement.children[`month-${defaultDateIndex}`];
    const domElemReadyWaitTime = 300;

    setTimeout(() => {
      const defaultDateMonth = monthElement ? monthElement.offsetTop : 0;

      if (defaultDateIndex !== -1 && defaultDateMonth !== 0) {
        this.content().scrollByPoint(0, defaultDateMonth, 128);
      }
    }, domElemReadyWaitTime);
  }

  scrollToDefaultDate(): void {
    this.scrollToDate(this._d.defaultScrollTo);
  }

  onScroll($event: IonContentCustomEvent<ScrollDetail>): void {
    if (!this._d.canBackwardsSelected) return;

    const { detail } = $event;

    if (detail.scrollTop <= 200 && detail.velocityY < 0 && this._scrollLock) {
      this.content()
        .getScrollElement()
        .then(() => {
          this._scrollLock = !1;

          // const heightBeforeMonthPrepend = scrollElem.scrollHeight;
          this.backwardsMonth();
          setTimeout(() => {
            //  const heightAfterMonthPrepend = scrollElem.scrollHeight;

            // this.content.scrollByPoint(0, heightAfterMonthPrepend - heightBeforeMonthPrepend, 0).then(() => {
            this._scrollLock = !0;
            // });
          }, 180);
        });
    }
  }

  /**
   * In some older Safari versions (observed at Mac's Safari 10.0), there is an issue where style updates to
   * shadowRoot descendants don't cause a browser repaint.
   * See for more details: https://github.com/Polymer/polymer/issues/4701
   */
  async repaintDOM() {
    const scrollElem = await this.content().getScrollElement();
    // Update scrollElem to ensure that height of the container changes as Months are appended/prepended
    scrollElem.style.zIndex = '2';
    scrollElem.style.zIndex = 'initial';
    // Update monthsEle to ensure selected state is reflected when tapping on a day
    const monthsEle = this.monthsEle();
    monthsEle.nativeElement.style.zIndex = '2';
    monthsEle.nativeElement.style.zIndex = 'initial';
  }

  findInitMonthNumber(date: Date): number {
    let startDate = this.actualFirstTime
      ? new Date(this.actualFirstTime)
      : new Date(this._d.from);
    const defaultScrollTo = new Date(date);
    const after: boolean = isAfter(defaultScrollTo, startDate);
    if (!after) return -1;

    if (this.showYearPicker) {
      startDate = new Date(this.year, 0, 1);
    }

    return differenceInMonths(defaultScrollTo, startDate);
  }

  _getDayTime(date: DefaultDate): number {
    return startOfDay(new Date(date)).valueOf();
  }

  _monthFormat(date: DefaultDate): string {
    return format(new Date(date), this._d.monthFormat);
  }
}
