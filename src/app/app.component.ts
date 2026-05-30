import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    public router: Router,
    private platform: Platform
  ) {
    const token = localStorage.getItem('token');
      if (token) {
        this.router.navigateByUrl('/home');
        return;
      }
      this.autoInitializeApp();
      this.initializeBackButtonHandler();
  }

  autoInitializeApp() {
    this.router.navigateByUrl('splash');
  }

  private initializeBackButtonHandler() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        const currentPath = this.router.url.split('?')[0].split('#')[0];

        if (currentPath === '/welcome' || currentPath === '/home' || currentPath === '/') {
          CapacitorApp.exitApp();
          return;
        }

        this.router.navigateByUrl('/home', { replaceUrl: true });
      });
    });
  }
}
