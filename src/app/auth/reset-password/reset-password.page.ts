import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {

  email: string = '';

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  resetPassword() {
    console.log("Email berhasil dikirim!");
    this.navCtrl.navigateRoot('/login');
  }
}
