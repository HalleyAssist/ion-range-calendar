import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';

import { startOfDay, subDays } from 'date-fns';

import { ionChange } from 'projects/ion-range-calendar/src/lib/components/ion-range-calendar/ion-range-calendar.component';
import { IonRangeCalendarComponent } from '../../../ion-range-calendar/src/lib/components/ion-range-calendar/ion-range-calendar.component';

import { CalendarModal, CalendarModalOptions, PickMode } from 'projects/ion-range-calendar/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    FormsModule,

    IonRangeCalendarComponent,

    IonApp,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  ]
})
export class AppComponent {

  public date? = new Date();
  public dateRange: { from?: Date, to?: Date } = { from: new Date(), to: new Date() };
  public dates = [new Date(), new Date()];

  public mode: PickMode = 'range';

  private from: Date = startOfDay(subDays(new Date(), 6));
  private to: Date = startOfDay(new Date());

  public options: CalendarModalOptions = {
    pickMode: this.mode,
    title: 'Select Date Range',
    cssClass: 'calendar',
    canBackwardsSelected: true,
    to: new Date(),
    defaultDateRange: { to: this.to, from: this.from },
    doneIcon: true,
    clearIcon: true,
    closeIcon: true,
    defaultScrollTo: this.from,
    maxRange: 28,
  };

  private modalCtrl = inject(ModalController);

  constructor() {
    this.dateRange = { from: this.from, to: this.to };
  }

  public get data() {
    switch (this.mode) {
      case 'range':
        return this.dateRange;
      case 'multi':
        return this.dates;
      default:
        return this.date;
    }
  }

  public set data(value: ionChange) {
    console.info(this.mode, value);
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
      cssClass: ['calendar-modal'],
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.info(data);
  }

  public onChange(event: ionChange) {
    console.info(event);
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
