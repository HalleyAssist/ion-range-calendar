import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import moment from 'moment-timezone';
import { CalendarModal, CalendarModalOptions } from 'projects/ion-range-calendar/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public date = moment();

  private from: moment.Moment = moment().startOf('day').subtract(6, 'days');
  private to: moment.Moment = moment().startOf('day');

  private options: CalendarModalOptions = {
    pickMode: 'range',
    title: 'Select Date Range',
    cssClass: 'calendar',
    canBackwardsSelected: true,
    to: this.to.toDate(),
    defaultDateRange: { to: this.to.toDate(), from: this.from.toDate() },
    doneIcon: true,
    clearIcon: true,
    closeIcon: true,
    defaultScrollTo: this.from.toDate(),
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

  public onChange(event: any) {
    console.log(event);
  }

}
