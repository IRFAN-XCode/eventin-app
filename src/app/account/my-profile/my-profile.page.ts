import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Api } from 'src/app/services/api';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: false,
})
export class MyProfilePage implements OnInit {

  userDetail: any;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private api: Api,
    private router: Router,
    private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();

    this.api.getProfileUser().subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.userDetail = res.data;
        }
      },
      error: async (err) => {
        await loading.dismiss();
        let errorMsg = 'Gagal memuat profil.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.presentToast(errorMsg, 'danger');
      }
    });
  }

  ionViewWillEnter() {
    this.userDetail = this.api.getUser();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
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
        this.deleteAccount();
      },
    },
  ];

  async deleteAccount() {
    const loading = await this.loadingCtrl.create({
      message: 'Menghapus akun permanen...',
    });
    await loading.present();

    this.api.deleteAccount().subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.presentToast(res.message || 'Akun berhasil dihapus', 'success');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      },
      error: async (err) => {
        await loading.dismiss();
        let errorMsg = 'Gagal menghapus akun.';

        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }

        this.presentToast(errorMsg, 'danger');

        if (err.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      }
    });
  }

}
