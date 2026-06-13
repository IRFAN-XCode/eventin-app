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
  intervalQr: any;

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
    this.stopQrInterval();
    
    if (this.kodeTransaksi) {
      this.loadTicketData();
    }
  }

  ionViewDidEnter() {
    this.viewEntered = true;
    
    if (this.ticketDetail && this.ticketDetail.kode_transaksi) {
      this.StartQrInterval();
    }
  }

  ionViewWillLeave() {
    this.stopQrInterval();
  }

  ngOnDestroy() {
    this.stopQrInterval();
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
            this.StartQrInterval();
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.presentToast('Gagal memuat detail tiket.', 'danger');
      }
    });
  }

  StartQrInterval() {
    this.stopQrInterval();
    this.generateSecurityQr();

    this.intervalQr = setInterval(() => {
      this.generateSecurityQr();
    }, 60000);
  }

  generateSecurityQr() {
    if (!this.ticketDetail || !this.ticketDetail.kode_transaksi) return;

    const kode = this.ticketDetail.kode_transaksi;
    const timestamp = Math.floor(Date.now() / 1000);
    const rawPayload = `${kode}||${timestamp}`;
    this.StringQrCode = btoa(rawPayload);
  }

  stopQrInterval() {
    if (this.intervalQr) {
      clearInterval(this.intervalQr);
      this.intervalQr = null;
    }
  }

  handleRefresh(event: any) {  
    const token = this.api.getToken();

    this.api.getDetailTicket(this.kodeTransaksi, token).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.ticketDetail = res.data;
          
          if (this.viewEntered) {
            this.StartQrInterval();
          }
        }
        event.target.complete(); 
      },
      error: (err: any) => {
        event.target.complete(); 
        this.presentToast('Gagal menyegarkan data tiket.', 'danger');
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
