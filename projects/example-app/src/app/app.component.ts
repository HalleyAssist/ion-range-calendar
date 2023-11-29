import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { startOfDay, subDays } from 'date-fns';

import { CalendarChange } from 'projects/ion-range-calendar/src/lib/components/ion-range-calendar/ion-range-calendar.component';

import { CalendarModal, CalendarModalOptions } from 'projects/ion-range-calendar/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public date = new Date();

  private from: Date = subDays(startOfDay(Date.now()), 6);
  private to: Date = startOfDay(Date.now());

  private options: CalendarModalOptions = {
    pickMode: 'range',
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
  ) { }

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

}
