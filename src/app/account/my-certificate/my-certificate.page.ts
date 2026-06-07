import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Api } from 'src/app/services/api';

@Component({
  selector: 'app-my-certificate',
  templateUrl: './my-certificate.page.html',
  styleUrls: ['./my-certificate.page.scss'],
  standalone: false,
})
export class MyCertificatePage implements OnInit {

  isLoading: boolean = false;
  certificates: any[] = [];
  totalCount: number = 0;
  
  isModalOpen: boolean = false;
  selectedCert: any = null;

  participantsList: any[] = [];
  certificateStats: any = {
    eligible: 0,
    sent: 0,
    pending: 0
  };

  currentSegment: string = 'list';
  certIdInput: string = ''; 
  isVerifyingLoading: boolean = false; 
  certData: any = null;         
  errorMessage: string = '';

  constructor(
    private api: Api,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadMyCertificates();

    this.certIdInput = '';
    this.certData = null;
    this.errorMessage = '';
  }

  loadMyCertificates() {
    this.isLoading = true;
    this.api.getCertificate().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.success) {
          this.certificates = res.data;
          this.totalCount = res.data.length;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.presentToast('Gagal memuat sertifikat Anda.', 'danger');
      }
    });
  }

  downloadCertificate(downloadUrl: string, eventName: string) {
    if (!downloadUrl) {
      this.presentToast('Tautan unduhan tidak tersedia', 'danger');
      return;
    }

    this.presentToast('Mengunduh Sertifikat.', 'success');
    const token = localStorage.getItem('token');
    const secureUrl = `${downloadUrl}?token=${token}`;

    (window as any).open(secureUrl, '_system', 'location=yes');
  }

  checkValidity() {
    if (!this.certIdInput.trim()) {
      this.presentToast('Silahkan masukkan ID sertifikat terlebih dahulu.', 'warning');
      return;
    }

    this.isVerifyingLoading = true;
    this.certData = null;
    this.errorMessage = '';

    this.api.verifyCertificate(this.certIdInput.trim()).subscribe({
      next: (res: any) => {
        this.isVerifyingLoading = false;
        if (res.success) {
          this.certData = res.data;
          this.presentToast('Sertifikat Berhasil Terverifikasi', 'success');
        }
      },
      error: (err: any) => {
        this.isVerifyingLoading = false;
        this.errorMessage = err.error?.message || 'Kode sertifkat tidak ditemukan.';
        this.presentToast('Verifikasi gagal', 'danger');
      }
    });
  }

  lihatSertifikatStatis(cert: any) {
    this.selectedCert = cert;
    this.isModalOpen = true;
  }

  tutupModal() {
    this.isModalOpen = false;
    this.selectedCert = null;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2000, position: 'top', color
    });
    await toast.present();
  }
}
