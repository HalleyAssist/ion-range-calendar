import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { startOfDay, subDays } from 'date-fns';
import { PickMode } from 'ion-range-calendar';

import { CalendarChange } from 'projects/ion-range-calendar/src/lib/components/ion-range-calendar/ion-range-calendar.component';

import { CalendarModal, CalendarModalOptions } from 'projects/ion-range-calendar/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public date? = new Date();
  public dateRange: { from?: Date, to?: Date } = { from: new Date(), to: new Date() };
  public dates = [new Date(), new Date()];

  public mode: PickMode = 'range';

  private from: Date = subDays(startOfDay(Date.now()), 6);
  private to: Date = startOfDay(Date.now());

  public options: CalendarModalOptions = {
    pickMode: this.mode,
    title: 'Select Date Range',
    cssClass: 'calendar',
    canBackwardsSelected: true,
    to: this.to,
    defaultDateRange: { to: this.to, from: this.from },
    doneIcon: true,
    clearIcon: true,
    closeIcon: true,
    defaultScrollTo: this.from,
    maxRange: 28,
  };

  constructor(
    private modalCtrl: ModalController,
  ) {
    this.dateRange = { from: this.from, to: this.to };
  }

  public get data() {
    switch (this.mode) {
      case 'single':
        return this.date;
      case 'range':
        return this.dateRange;
      case 'multi':
        return this.dates;
    }
  }

  public set data(value: CalendarChange) {
    console.log(this.mode, value);
    switch (this.mode) {
      case 'single':
        this.date = value as Date;
        break;
      case 'range':
        this.dateRange = value as { from: Date, to: Date };
        break;
      case 'multi':
        this.dates = value as Date[];
        break;
    }
  }

  public async onClick() {
    const modal = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options: this.options },
      cssClass: ['calendar-modal']
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
  }

  public onChange(event: CalendarChange) {
    console.log(event);
  }

  public resetData() {
    switch (this.mode) {
      case 'single':
        this.date = undefined;
        break;
      case 'range':
        this.dateRange = {};
        break;
      case 'multi':
        this.dates = [];
        break;
    }
  }

}
