import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Api } from 'src/app/services/api';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.page.html',
  styleUrls: ['./reward.page.scss'],
  standalone: false,
})
export class RewardPage implements OnInit {

  isLoading: boolean = false;
  rewardList: any[] = [];

  constructor(
    private api : Api,
    private toast : ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadMyReward();
  }

  loadMyReward() {
    this.isLoading = true;
    this.api.getMyReward().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.rewardList = res.data;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error reward page:', err);
        this.presentToast('Gagal memuat data riwayat hadiah.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}
