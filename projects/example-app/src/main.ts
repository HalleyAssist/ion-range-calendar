import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { provideIonicAngular } from '@ionic/angular/standalone';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({
      useSetInputAPI: true, //  required for input signals on controller based modals.
    })
  ]
})
  .catch(err => console.error(err));
