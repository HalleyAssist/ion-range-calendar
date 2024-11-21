import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonSelect, ModalController } from '@ionic/angular/standalone';

import { IonRangeCalendarComponent } from 'projects/ion-range-calendar/src/public-api';

import { AppComponent } from './app.component';

import { format } from 'date-fns';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  let modalCtrlSpy: jasmine.SpyObj<ModalController>;
  let modalSpy: jasmine.SpyObj<HTMLIonModalElement>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('HTMLIonModalElement', {
      present: Promise.resolve(),
      onWillDismiss: Promise.resolve({ data: { from: new Date(2020, 0, 1), to: new Date(2020, 0, 2) } }),
    });
    modalCtrlSpy = jasmine.createSpyObj('ModalController', {
      create: Promise.resolve(modalSpy),
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterModule,
        FormsModule,
        IonRangeCalendarComponent,
        IonSelect,
        AppComponent,
      ],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should create the modal', fakeAsync(() => {
    app.onClick();
    app.onChange(format(Date.now(), 'yyyy-MM-ddTHH:mm:ssXXX'));
    flush();
    expect(modalCtrlSpy.create).toHaveBeenCalled();
    expect(modalSpy.present).toHaveBeenCalled();
    expect(modalSpy.onWillDismiss).toHaveBeenCalled();
  }));
});
