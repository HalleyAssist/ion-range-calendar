import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { addDays, parse, startOfDay, subDays } from "date-fns";

import { CalendarDay, CalendarModalOptions, CalendarMonth } from "../calendar.model";

import { MonthComponent } from "./month.component";

describe('MonthComponent', () => {
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;

  let month: CalendarMonth;

  const now = parse('2022-04-15', 'yyyy-MM-dd', new Date());
  const from = subDays(startOfDay(now), 6);
  const to = startOfDay(now);

  let opts: CalendarModalOptions = {
    pickMode: 'range',
    title: 'Select Date Range',
    cssClass: 'calendar',
    canBackwardsSelected: true,
    to: to,
    doneIcon: true,
    clearIcon: true,
    closeIcon: true,
    defaultScrollTo: from,
    maxRange: 28,
  };

  const start: CalendarDay = {
    time: +from,
    isToday: false,
    disable: false,
    cssClass: '',
  };
  const end: CalendarDay = {
    time: +to,
    isToday: false,
    disable: false,
    cssClass: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MonthComponent,
      ],
      imports: [
        FormsModule,
        IonicModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    //  set service opts.
    component.service.safeOpt(opts);
    //  create month
    month = component.service.createMonthsByPeriod(new Date('2022-04-01').valueOf(), 1, opts)[0];
    //  set required component inputs
    component.month = month;
    component.pickMode = 'range';
    //  detect changes
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Range selection', () => {
    it('should select a range', () => {
      component.onSelected(start);
      component.onSelected(end);
      expect(component.value).toEqual([start, end]);
    });

    it('should select a reverse range', () => {
      component.onSelected(end);
      expect(component.value).toEqual([end, null]);
      component.onSelected(start);
      expect(component.value).toEqual([start, end]);
    });

    it('should expand the range', () => {
      component.onSelected(start);
      component.onSelected(end);
      expect(component.value).toEqual([start, end]);

      // increase start
      const newStart = Object.assign({}, start);
      newStart.time = +subDays(start.time, 2);
      component.onSelected(newStart);
      expect(component.value).toEqual([newStart, end]);

      // increase end
      const newEnd = Object.assign({}, end);
      newEnd.time = +addDays(end.time, 2);
      component.onSelected(newEnd);
      expect(component.value).toEqual([newStart, newEnd]);
    });

    it('should shift the range', () => {
      //  set initial range to end before to
      const newStart = Object.assign({}, start);
      newStart.time = +subDays(newStart.time, 4);
      component.onSelected(newStart);
      const newEnd = Object.assign({}, end);
      newEnd.time = +subDays(newEnd.time, 4);
      component.onSelected(newEnd);
      expect(component.value).toEqual([newStart, newEnd]);
      //  select day between range
      const day = Object.assign({}, newStart);
      day.time = +addDays(newStart.time, 2);
      //  expect end to be shifted
      const expectedEnd = Object.assign({}, end);
      expectedEnd.time = +addDays(newEnd.time, 2);
      component.onSelected(day);
      expect(component.value).toEqual([day, expectedEnd]);
    });

    it('should not shift the range past the defined to value', () => {
      component.onSelected(start);
      component.onSelected(end);
      expect(component.value).toEqual([start, end]);
      //  select day between range
      const day = Object.assign({}, start);
      day.time = +addDays(start.time, 2);
      component.onSelected(day);
      expect(component.value).toEqual([day, end]);
    });

    it('should limit the range to the defined maxRange', () => {
      component.onSelected(start);
      component.onSelected(end);
      expect(component.value).toEqual([start, end]);
      //  set range to max range
      const newStart = Object.assign({}, start);
      newStart.time = +subDays(newStart.time, 45);
      component.onSelected(newStart);
      //  expect end to be start plus max range
      const expectedEnd = Object.assign({}, end);
      expectedEnd.time = +addDays(newStart.time, 27);
      expect(component.value).toEqual([newStart, expectedEnd]);
      //  shift range by end
      const newEnd = Object.assign({}, expectedEnd);
      newEnd.time = +addDays(expectedEnd.time, 14);
      component.onSelected(newEnd);
      //  expect start to be end minus max range
      const expectedStart = Object.assign({}, newEnd);
      expectedStart.time = +subDays(newEnd.time, 27);
      expect(component.value).toEqual([expectedStart, newEnd]);
    });

  });
})
