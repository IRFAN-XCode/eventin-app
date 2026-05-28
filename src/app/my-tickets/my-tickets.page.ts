import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.page.html',
  styleUrls: ['./my-tickets.page.scss'],
  standalone: false,
})
export class MyTicketsPage implements OnInit {

  listTicket: any[] = [];
  isLoading: boolean = false;
  filterTiket: any[] = [];

  statusFilter: string = 'success';

  constructor(
    private api: Api,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadUserTickets();
  }

  ionViewWillEnter() {
    this.loadUserTickets();
  }

  loadUserTickets() {
    this.isLoading = true;
    const token = localStorage.getItem('token');

    this.api.getMyTickets(token).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.listTicket = res.data || [];          
          this.eksekusiFilter();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.presentToast('Gagal memuat daftar tiket Anda.', 'danger');
      }
    });
  }

  gantiStatusFilter(statusBaru: string) {
    this.statusFilter = statusBaru;
    this.eksekusiFilter();
  }

  eksekusiFilter() {
    if (!this.listTicket || this.listTicket.length === 0) {
      this.filterTiket = [];
      return;
    }

    this.filterTiket = this.listTicket.filter((tiket: any) => {
        if (!tiket.status_pembayaran) return false;

        return tiket.status_pembayaran.trim() === this.statusFilter.trim();
    });
  }

  bukaDetailTiket(kodeTransaksi: string) {
    this.router.navigate(['/detail-ticket', kodeTransaksi]);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    await toast.present();
  }

}
