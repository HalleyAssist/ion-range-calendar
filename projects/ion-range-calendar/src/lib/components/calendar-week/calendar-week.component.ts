import { Component, computed, input } from '@angular/core';
import { defaults } from '../../config';

import { IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'ion-range-calendar-week',
  styleUrls: ['./calendar-week.component.scss'],
  templateUrl: 'calendar-week-component.html',
  imports: [
    IonToolbar,
  ]
})
export class CalendarWeekComponent {

  readonly color = input(defaults.COLOR);

  readonly weekArray = input(defaults.WEEKS_FORMAT, { transform: this.setWeekArray });

  readonly weekStart = input(0, { transform: this.setWeekStart });

  readonly displayWeekArray = computed<string[]>(() => {
    if (this.weekStart() === 1) {
      const cacheWeekArray = [...this.weekArray()];
      cacheWeekArray.push(cacheWeekArray.shift());
      return [...cacheWeekArray];
    }
    return this.weekArray();
  });

  private setWeekArray(value: string[]): string[] {
    if (value && value.length === 7) {
      return [...value];
    }
    return defaults.WEEKS_FORMAT;
  }

  private setWeekStart(value: number): number {
    // return 0 or 1, default 0
    return value === 1 ? 1 : 0;
  }

}
