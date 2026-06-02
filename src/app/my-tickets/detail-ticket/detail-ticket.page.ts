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

  StringQrCode: string = '';
  viewEntered: boolean = false;

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
        }
      },
      error: (err) => {
        console.error('Error membaca parameter routing:', err);
      }
    });
  }

  ionViewWillEnter() {
    this.viewEntered = false;
    this.StringQrCode = '';
    
    if (this.kodeTransaksi) {
      this.loadTicketData();
    }
  }

  ionViewDidEnter() {
    this.viewEntered = true;
    
    if (this.ticketDetail && this.ticketDetail.kode_transaksi) {
      this.StringQrCode = this.ticketDetail.kode_transaksi;
    }
  }

  ionViewWillLeave() {
    this.StringQrCode = '';
  }

  loadTicketData() {
    this.isLoading = true;
    const token = localStorage.getItem('token');

    this.api.getDetailTicket(this.kodeTransaksi, token).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.ticketDetail = res.data;
          
          if (this.viewEntered) {
            this.StringQrCode = this.ticketDetail.kode_transaksi;
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.presentToast('Gagal memuat detail tiket.', 'danger');
      }
    });
  }

  downloadTiket() {
    if (!this.kodeTransaksi) return;
    const downloadPDF = this.api.getTiketDownload(this.kodeTransaksi);
    (window as any).open(downloadPDF, '_blank');
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toast.create({
      message, 
      duration: 2500,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}
