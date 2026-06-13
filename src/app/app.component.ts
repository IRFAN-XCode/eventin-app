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
    this.platform.ready().then(() => {
      this.initializeBackButtonHandler();
      const token = localStorage.getItem('token');
      const FirstTime = localStorage.getItem('FirstTime');
      
      if (FirstTime === 'false') {
        if (token) {
          this.router.navigateByUrl('/home', { replaceUrl: true });
          return;
        }
        this.router.navigateByUrl('/login', { replaceUrl: true });
      } else {
        this.autoInitializeApp(); 
      }
    });
  }

  autoInitializeApp() {
    this.router.navigateByUrl('/splash', { replaceUrl: true });
  }

  private initializeBackButtonHandler() {
    
      this.platform.backButton.subscribeWithPriority(10, () => {
        const currentPath = this.router.url.split('?')[0].split('#')[0];

        if (currentPath === '/regist') {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        } else {
          if (currentPath === '/login' || currentPath === '/welcome' || currentPath === '/home' || currentPath === '/') {
            CapacitorApp.exitApp();
            return;
          }
        }

        this.router.navigateByUrl('/home', { replaceUrl: true });
      });
    };
  }
