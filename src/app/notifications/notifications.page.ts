import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Api } from '../services/api';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {

  isLoading: boolean = false;
  NotificationsLog: any[] = [];

  constructor(
    private api: Api,
    private toast: ToastController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const token = this.api.getToken();
    if (token) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.isLoading = true;
    this.api.getNotifications().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.NotificationsLog = res.data;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching notifications:', err);
        this.presentToast('Gagal memuat pemberitahuan.', 'danger');
      }
    });
  }

  readNotif(id: any) {
    const notif = this.NotificationsLog.find(n => n.id === id);
    if (notif) {
      notif.read_at = new Date();
    }
    this.api.readNotifById(id).subscribe({
      next: (res: any) => {
        this.loadNotifications();
      },
      error: (err: any) => {
        if (notif) notif.read_at = null;
        this.presentToast('Gagal memperbarui status baca.', 'danger');
      }
    });
  }

  readAll() {
    if (this.NotificationsLog.length === 0) return;
    
    this.api.markAllNotificationsAsRead().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.presentToast('Semua notifikasi telah dibaca', 'success');
          this.loadNotifications();
        }
      },
      error: (err) => this.presentToast('Gagal memperbarui status baca.', 'danger')
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });
    await toast.present();
  }
}

