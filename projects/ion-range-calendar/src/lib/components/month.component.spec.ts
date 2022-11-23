import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import moment from "moment";
import { CalendarDay, CalendarModalOptions, CalendarMonth } from "../calendar.model";
import { IonRangeCalendarService } from "../services/ion-range-calendar.service";
import { MonthComponent } from "./month.component";


describe('MonthComponent', () => {
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;

  let month: CalendarMonth;

  const now = moment('2022-04-15');
  const from = now.clone().startOf('day').subtract(6, 'days');
  const to = now.clone().startOf('day')
  let opts: CalendarModalOptions = {
    pickMode: 'range',
    title: 'Select Date Range',
    cssClass: 'calendar',
    canBackwardsSelected: true,
    to: to.toDate(),
    doneIcon: true,
    clearIcon: true,
    closeIcon: true,
    defaultScrollTo: from.toDate(),
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
    month = component.service.createMonthsByPeriod(+moment('2022-04-01'), 1, opts)[0];
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
      newStart.time = +moment(start.time).subtract(2, 'days');
      component.onSelected(newStart);
      expect(component.value).toEqual([newStart, end]);

      // increase end
      const newEnd = Object.assign({}, end);
      newEnd.time = +moment(end.time).add(2, 'days');
      component.onSelected(newEnd);
      expect(component.value).toEqual([newStart, newEnd]);
    });

    it('should shift the range', () => {
      //  set inital range to end before to
      const newStart = Object.assign({}, start);
      newStart.time = +moment(newStart.time).subtract(4, 'days');
      component.onSelected(newStart);
      const newEnd = Object.assign({}, end);
      newEnd.time = +moment(newEnd.time).subtract(4, 'days');
      component.onSelected(newEnd);
      expect(component.value).toEqual([newStart, newEnd]);
      //  select day between range
      const day = Object.assign({}, newStart);
      day.time = +moment(newStart.time).add(2, 'days');
      //  expect end to be shifted
      const expectedEnd = Object.assign({}, end);
      expectedEnd.time = +moment(newEnd.time).add(2, 'days');
      component.onSelected(day);
      expect(component.value).toEqual([day, expectedEnd]);
    });

    it('should not shift the range past the defined to value', () => {
      component.onSelected(start);
      component.onSelected(end);
      expect(component.value).toEqual([start, end]);
      //  select day between range
      const day = Object.assign({}, start);
      day.time = +moment(start.time).add(2, 'days');
      component.onSelected(day);
      expect(component.value).toEqual([day, end]);
    });

    it('should limit the range to the defined maxRange', () => {
      component.onSelected(start);
      component.onSelected(end);
      expect(component.value).toEqual([start, end]);
      //  set range to max range
      const newStart = Object.assign({}, start);
      newStart.time = +moment(newStart.time).subtract(45, 'days');
      component.onSelected(newStart);
      //  expect end to be start plus max range
      const expectedEnd = Object.assign({}, end);
      expectedEnd.time = +moment(newStart.time).add(27, 'days');
      expect(component.value).toEqual([newStart, expectedEnd]);
      //  shift range by end
      const newEnd = Object.assign({}, expectedEnd);
      newEnd.time = +moment(expectedEnd.time).add(14, 'days');
      component.onSelected(newEnd);
      //  expect start to be end minus max range
      const expectedStart = Object.assign({}, newEnd);
      expectedStart.time = +moment(newEnd.time).subtract(27, 'days');
      expect(component.value).toEqual([expectedStart, newEnd]);
    });

  });
})
