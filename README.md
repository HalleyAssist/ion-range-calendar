# Ion Range Calendar

[![NPM version][npm-image]][npm-url]
[![MIT License][license-image]][license-url]

Forked from : <https://github.com/hsuanxyz/ion-range-calendar>

* Supports date range.
* Supports multi date.
* Supports HTML components.
* Disable weekdays or weekends.
* Setting days event.
* Setting localization.
* Material design.

## Supports

* `"@ionic/angular": ">=7.0.0"`

## Usage

### Installation

```bash
 npm i @googlproxer/ion-range-calendar date-fns date-fns-tz
 ```

### Import module

```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '@ionic/angular';
import { MyApp } from './app.component';
...
import { IonRangeCalendarModule } from '@googlproxer/ion-range-calendar';

@NgModule({
  declarations: [
    MyApp,
    ...
  ],
  imports: [
    IonicModule.forRoot(),
    IonRangeCalendarModule
  ],
  bootstrap: [MyApp],
  ...
})
export class AppModule {}
```

### Change Defaults

```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
...
import { IonRangeCalendarModule } from "ion-range-calendar";

@NgModule({
  declarations: [
    MyApp,
    ...
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    // See CalendarComponentOptions for options
    IonRangeCalendarModule.forRoot({
      doneLabel: 'Save',
      closeIcon: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ...
  ]
})
export class AppModule {}
```

## As Component

### Basic

```html
<ion-range-calendar [(ngModel)]="date" (change)="onChange($event)" [type]="type" [format]="'yyyy-MM-dd'">
</ion-range-calendar>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  date: string;
  type: 'string'; // 'string' | 'js-date' | 'time' | 'object'
  constructor() { }

  onChange($event) {
    console.log($event);
  }
  ...
}
```

### Date range

```html
<ion-range-calendar [(ngModel)]="dateRange" [options]="optionsRange" [type]="type" [format]="'yyyy-MM-dd'">
</ion-range-calendar>
```

```typescript
import { Component } from '@angular/core';
import { CalendarComponentOptions } from '@googlproxer/ion-range-calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  constructor() { }
  ...
}
```

### Multi Date

```html
<ion-range-calendar [(ngModel)]="dateMulti" [options]="optionsMulti" [type]="type" [format]="'yyyy-MM-dd'">
</ion-range-calendar>
```

```typescript
import { Component } from '@angular/core';
import { CalendarComponentOptions } from '@googlproxer/ion-range-calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dateMulti: string[];
  type: 'string'; // 'string' | 'js-date' | 'time' | 'object'
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };

  constructor() { }
  ...
}
```

### Input Properties

| Name     | Type                       | Default      | Description            |
| -------- | -------------------------- | ------------ | ---------------------- |
| options  | `CalendarComponentOptions` | null         | options                |
| format   | `string`                   | 'yyyy-MM-dd' | date-fns format string |
| type     | `string`                   | 'string'     | value type             |
| readonly | `boolean`                  | false        | readonly               |

### Output Properties

| Name        | Type           | Description                |
| ----------- | -------------- | -------------------------- |
| change      | `EventEmitter` | event for model change     |
| monthChange | `EventEmitter` | event for month change     |
| select      | `EventEmitter` | event for day select       |
| selectStart | `EventEmitter` | event for day select       |
| selectEnd   | `EventEmitter` | event for day select       |

### CalendarComponentOptions

| Name              | Type                      | Default                                                                                | Description                                       |
| ----------------- | ------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------- |
| from              | `Date` or `number`        | `new Date()`                                                                           | start date                                        |
| to                | `Date` or `number`        | 0 (Infinite)                                                                           | end date                                          |
| color             | `string`                  | `'primary'`                                                                            | 'primary', 'secondary', 'danger', 'light', 'dark' |
| pickMode          | `string`                  | `single`                                                                               | 'multi', 'range', 'single'                        |
| showToggleButtons | `boolean`                 | `true`                                                                                 | show toggle buttons                               |
| showMonthPicker   | `boolean`                 | `true`                                                                                 | show month picker                                 |
| monthPickerFormat | `Array<string>`           | `['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']` | month picker format                               |
| defaultTitle      | `string`                  | ''                                                                                     | default title in days                             |
| defaultSubtitle   | `string`                  | ''                                                                                     | default subtitle in days                          |
| disableWeeks      | `Array<number>`           | `[]`                                                                                   | week to be disabled (0-6)                         |
| monthFormat       | `string`                  | `'MMM yyyy'`                                                                           | month title format                                |
| weekdays          | `Array<string>`           | `['S', 'M', 'T', 'W', 'T', 'F', 'S']`                                                  | weeks text                                        |
| weekStart         | `number`                  | `0` (0 or 1)                                                                           | set week start day                                |
| daysConfig        | `Array<DaysConfig>`       | `[]`                                                                                   | days configuration                                |
| maxRange          | `number`                  | 0                                                                                      | The maximum range of the selection in days        |

## As Modal

### Basic Modal

Import ion-range-calendar in component controller.

```typescript
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult
} from '@googlproxer/ion-range-calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public modalCtrl: ModalController) {}

  openCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC'
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    console.log(date);
  }
}
```

### Date range Modal

Set pickMode to 'range'.

```typescript
openCalendar() {
  const options: CalendarModalOptions = {
    pickMode: 'range',
    title: 'RANGE'
  };

  const myCalendar = await this.modalCtrl.create({
    component: CalendarModal,
    componentProps: { options }
  });

  myCalendar.present();

  const event = await myCalendar.onDidDismiss();
  const date = event.data;
  const from: CalendarResult = date.from;
  const to: CalendarResult = date.to;

  console.log(date, from, to);
}
```

### Multi Date Modal

Set pickMode to 'multi'.

```typescript
openCalendar() {
  const options = {
    pickMode: 'multi',
    title: 'MULTI'
  };

  const myCalendar = await this.modalCtrl.create({
    component: CalendarModal,
    componentProps: { options }
  });

  myCalendar.present();

  const event = await myCalendar.onDidDismiss();
  const date: CalendarResult = event.data;
  console.log(date);
}
```

### Disable weeks

Use index eg: `[0, 6]` denote Sunday and Saturday.

```typescript
openCalendar() {
  const options: CalendarModalOptions = {
    disableWeeks: [0, 6]
  };

  const myCalendar = await this.modalCtrl.create({
    component: CalendarModal,
    componentProps: { options }
  });

  myCalendar.present();

  const event = await myCalendar.onDidDismiss();
  const date: CalendarResult = event.data;
  console.log(date);
}
```

### Localization

your root module

```typescript
import { NgModule, LOCALE_ID } from '@angular/core';
...

@NgModule({
  ...
  providers: [{ provide: LOCALE_ID, useValue: "zh-CN" }]
})

...
```

```typescript
openCalendar() {
  const options: CalendarModalOptions = {
    monthFormat: 'yyyy 年 MM 月 ',
    weekdays: ['天', '一', '二', '三', '四', '五', '六'],
    weekStart: 1,
    defaultDate: new Date()
  };

  const myCalendar = await this.modalCtrl.create({
    component: CalendarModal,
    componentProps: { options }
  });

  myCalendar.present();

  const event = await myCalendar.onDidDismiss();
  const date: CalendarResult = event.data;
  console.log(date);
}
```

### Days config

Configure one day.

```typescript
openCalendar() {
  let _daysConfig: DayConfig[] = [];
  for (let i = 0; i < 31; i++) {
    _daysConfig.push({
      date: new Date(2017, 0, i + 1),
      subTitle: `$${i + 1}`
    })
  }

  const options: CalendarModalOptions = {
    from: new Date(2017, 0, 1),
    to: new Date(2017, 11.1),
    daysConfig: _daysConfig
  };

  const myCalendar = await this.modalCtrl.create({
    component: CalendarModal,
    componentProps: { options }
  });

  myCalendar.present();

  const event = await myCalendar.onDidDismiss();
  const date: CalendarResult = event.data;
  console.log(date);
}
```

## API

### Modal Options

| Name                      | Type                       | Default                               | Description                                                |
| ------------------------- | -------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| from                      | `Date` or `number`         | `new Date()`                          | start date                                                 |
| to                        | `Date` or `number`         | 0 (Infinite)                          | end date                                                   |
| title                     | `string`                   | `'CALENDAR'`                          | title                                                      |
| color                     | `string`                   | `'primary'`                           | 'primary', 'secondary', 'danger', 'light', 'dark'          |
| defaultScrollTo           | `Date`                     | undefined                             | let the view scroll to the default date                    |
| defaultDate               | `Date`                     | undefined                             | default date data, apply to single                         |
| defaultDates              | `Array<Date>`              | undefined                             | default dates data, apply to multi                         |
| defaultDateRange          | `{ from: Date, to: Date }` | undefined                             | default date-range data, apply to range                    |
| defaultTitle              | `string`                   | ''                                    | default title in days                                      |
| defaultSubtitle           | `string`                   | ''                                    | default subtitle in days                                   |
| cssClass                  | `string`                   | `''`                                  | Additional classes for custom styles, separated by spaces. |
| canBackwardsSelected      | `boolean`                  | `false`                               | Allow selection to any date before `to`                    |
| pickMode                  | `string`                   | `single`                              | 'multi', 'range', 'single'                                 |
| disableWeeks              | `Array<number>`            | `[]`                                  | week to be disabled (0-6)                                  |
| closeLabel                | `string`                   | `CANCEL`                              | cancel button label                                        |
| doneLabel                 | `string`                   | `DONE`                                | done button label                                          |
| clearLabel                | `string`                   |  null                                 | clear button label                                         |
| closeIcon                 | `boolean`                  | `false`                               | show cancel button icon                                    |
| doneIcon                  | `boolean`                  | `false`                               | show done button icon                                      |
| monthFormat               | `string`                   | `'MMM yyyy'`                          | month title format                                         |
| weekdays                  | `Array<string>`            | `['S', 'M', 'T', 'W', 'T', 'F', 'S']` | weeks text                                                 |
| weekStart                 | `number`                   | `0` (0 or 1)                          | set week start day                                         |
| daysConfig                | `Array<DaysConfig>`        | `[]`                                  | days configuration                                         |
| step                      | `number`                   | `12`                                  | month load stepping interval to when scroll                |
| defaultEndDateToStartDate | `boolean`                  | `false`                               | makes the end date optional, will default it to the start  |
| maxRange                  | `number`                   | 0                                     | The maximum range of the selection in days                 |

### onDidDismiss Output `{ data } = event`

| pickMode | Type                                                     |
| -------- | -------------------------------------------------------- |
| single   | `{ date: CalendarResult }`                               |
| range    | `{ from: CalendarResult, to: CalendarResult }`           |
| multi    | `Array<CalendarResult>`                                  |

### onDidDismiss Output `{ role } = event`

| Value      | Description                          |
| ---------- | ------------------------------------ |
| 'cancel'   | dismissed by click the cancel button |
| 'done'     | dismissed by click the done button   |
| 'backdrop' | dismissed by click the backdrop      |

#### DaysConfig

| Name     | Type      | Default   | Description                           |
| -------- | --------- | --------- | ------------------------------------- |
| cssClass | `string`  | `''`      | separated by spaces                   |
| date     | `Date`    | required  | configured days                       |
| marked   | `boolean` | false     | highlight color                       |
| disable  | `boolean` | false     | disable                               |
| title    | `string`  | undefined | displayed title eg: `'today'`         |
| subTitle | `string`  | undefined | subTitle subTitle eg: `'New Year\'s'` |

### CalendarResult

| Name    | Type     | Notes                |
| ------- | -------- | -------------------- |
| time    | `number` | unix milliseconds    |
| unix    | `number` | unix seconds         |
| dateObj | `Date`   | JS Date              |
| string  | `string` | format: `yyyy-MM-dd` |
| years   | `number` | year                 |
| months  | `number` | month                |
| date    | `number` | day                  |

[npm-image]: https://img.shields.io/npm/v/@googlproxer/ion-range-calendar.svg
[npm-url]: https://www.npmjs.com/package/@googlproxer/ion-range-calendar
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
