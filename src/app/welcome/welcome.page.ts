import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {
  currentStep: number = 1;
  finalStep: number = 3;

  constructor(
    private navCtrl: NavController
    ) { }

  ngOnInit() {
  }


  nextStep() {
    if (this.currentStep <= 3) {
      this.currentStep += 1;
      return;
    }
  }

  GoHome() {
    this.navCtrl.navigateRoot('/home');
  }

  login() {
    this.navCtrl.navigateRoot('/login');
  }

}
