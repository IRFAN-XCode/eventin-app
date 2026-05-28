import { Component, OnInit } from '@angular/core';
import { Api } from 'src/app/services/api';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.page.html',
  styleUrls: ['./detail-ticket.page.scss'],
  standalone: false,
})
export class DetailTicketPage implements OnInit {

  kodeTransaksi!: string;
  ticketDetail: any = null;
  isLoading: boolean = false;

  constructor(
    private api: Api,
    private toast : ToastController,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const paramKode = params.get('id');
        if (paramKode) {
          this.kodeTransaksi = paramKode;
          this.loadTicketData();
        }
      },
      error: (err) => {
        console.error('Error membaca parameter routing:', err);
      }
    });
  }

  downloadTiket() {
    if (!this.kodeTransaksi) return;

    const downloadPDF = this.api.getTiketDownload(this.kodeTransaksi);

    (window as any).open(downloadPDF, '_blank');
  }

  loadTicketData() {
    this.isLoading = true;
    const token = localStorage.getItem('token');

    this.api.getDetailTicketManual(this.kodeTransaksi, token).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.ticketDetail = res.data;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.presentToast('gagal memuat detail tiket.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toast.create({
      message, 
      duration: 2500,
      position: 'top'
    });
    await toast.present();
  }
}
