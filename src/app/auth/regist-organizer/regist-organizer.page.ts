import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-regist-organizer',
  templateUrl: './regist-organizer.page.html',
  styleUrls: ['./regist-organizer.page.scss'],
  standalone: false,
})
export class RegistOrganizerPage implements OnInit {

  nama_lengkap: string = '';
  email: string = '';
  name_eo: string = '';

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  registOrganizer() {
    console.log("Yey, berhasil buat akun!");
    this.navCtrl.navigateRoot('/login-organizer');
  }
}
