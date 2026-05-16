import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Api } from 'src/app/services/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  responseLogin: any = '';

  constructor(
    private navCtrl: NavController,
    private api: Api
  ) { }

  ngOnInit() {
  }

  login() {

    // this.api.doLogin(this.email, this.password).subscribe((res: any) => {
    //   if (res.success) {
    //     console.log('Login berhasil');
    //   } else {
    //     console.log('Login gagal');
    //   }
    // })

    if (!this.email || !this.password) {
      localStorage.setItem('responseLogin', 'Email dan Password harus diisi.')
      this.loginFail();
    } else {
      localStorage.setItem('emailUser', this.email);
      this.navCtrl.navigateBack('/home');
    }
  }


  loginFail() {
    this.responseLogin = localStorage.getItem('responseLogin');
    this.navCtrl.navigateBack('/login');
  }
}

