import { TestBed } from '@angular/core/testing';

import { IonRangeCalendarService } from './ion-range-calendar.service';

describe('IonRangeCalendarService', () => {
  let service: IonRangeCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IonRangeCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
