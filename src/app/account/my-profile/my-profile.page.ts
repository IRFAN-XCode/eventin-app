import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: false,
})
export class MyProfilePage implements OnInit {

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  public alertButtons = [
    {
      text: 'Batal',
      role: 'cancel',
      cssClass: 'tombol-batal',
    },
    {
      text: 'Hapus',
      role: 'confirm',
      handler: () => {
        this.displayMessageSuccess();
      },
    },
  ];

  async displayMessageSuccess() {
    const toast = await this.toastCtrl.create({
      message: "Akun Berhasil dihapus",
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }
}
