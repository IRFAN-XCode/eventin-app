import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login-organizer',
  templateUrl: './login-organizer.page.html',
  styleUrls: ['./login-organizer.page.scss'],
  standalone: false,
})
export class LoginOrganizerPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  loginOrganizer() {
    console.log("Yeay, berhasil login.");
    if (!this.email || !this.password) {
      console.log('Email dan password harus diisi');
      return;
    }

    this.navCtrl.navigateBack('/home');
  }

}
