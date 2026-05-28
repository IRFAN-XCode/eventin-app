import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    public router: Router
  ) {
    const token = localStorage.getItem('token');
      if (token) {
        this.router.navigateByUrl('/home');
        return;
      }
      this.autoInitializeApp();
  }

  autoInitializeApp() {
    this.router.navigateByUrl('splash');
  }
}
