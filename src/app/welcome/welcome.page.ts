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
  finalStep: number = 5;

  isPrivacyChecked: boolean = false;
  isTermsChecked: boolean = false;

  showPrivacyError: boolean = false;
  showTermsError: boolean = false;

  constructor(
    private navCtrl: NavController
    ) { }

  ngOnInit() {
  }


  nextStep() {
    if (this.currentStep === 4 && !this.isPrivacyChecked) {
      this.showPrivacyError = true;
      return; 
    }
    if (this.currentStep <= 5) {
      this.currentStep ++;
      return;
    }
  }
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep --;
      return;
    }
  }
  skip() {
    this.currentStep = 4;
  }

  GoHome() {
    if (!this.isTermsChecked) {
      this.showTermsError = true;
      return;
    }
    
    this.navCtrl.navigateRoot('/home');
  }

  login() {
    if (!this.isTermsChecked) {
      this.showTermsError = true;
      return;
    }
    this.navCtrl.navigateRoot('/login');
  }

}
