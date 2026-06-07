import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false,
})
export class AccountPage implements OnInit {

  UserProfile: any;

  constructor(
    private api: Api,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.UserProfile = null;
    } else {
      this.UserProfile = this.api.getUser();
    }
  }

 

  onLogout() {
    this.api.onLogout().subscribe({
      next: (res: any) => {
        this.presentToast(res.message || 'Logout berhasil', 'success');
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Backend logout error', err);
        localStorage.clear();
        this.presentToast('Sesi berakhir, keluar dari aplikasi..', 'danger');
        this.router.navigate(['/login']);
      }
    });
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
}
