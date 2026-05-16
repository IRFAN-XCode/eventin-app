import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
  standalone: false,
})
export class NewPasswordPage implements OnInit {

  password_old: string = '';
  password: string = '';
  confirm_password: string = '';

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  newPassword() {
    if (!this.password_old || !this.password || !this.confirm_password) {
      console.log('Kata sandi harus diisi');
      return;
    }
    if (this.password !== this.confirm_password) {
      console.log('Kata sandi tidak cocok');
      return;
    }
    this.navCtrl.navigateRoot('/account');
    console.log("Yeay, berhasil ganti password.");

  }
}
