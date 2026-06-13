import { Component, OnInit } from '@angular/core';
import { ToastController} from '@ionic/angular';
import { Api } from 'src/app/services/api';

@Component({
  selector: 'app-my-certificate',
  templateUrl: './my-certificate.page.html',
  styleUrls: ['./my-certificate.page.scss'],
  standalone: false,
})
export class MyCertificatePage implements OnInit {

  certificates: any[] = [];
  totalCount: number = 0;
  isLoading: boolean = false;

  isModalOpen: boolean = false;
  selectedCert: any = null;

  constructor(
    private api: Api,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadCertificates();
  }

  loadCertificates() {
    this.isLoading = true;
    
    this.api.getMyCertificates().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.certificates = res.data;
          this.totalCount = res.totalCount ?? res.data.length;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.presentToast('Gagal memuat daftar sertifikat.', 'danger');
      }
    });
  }

  getCategoryColor(kategori: string) {
    const k = kategori ? kategori.toLowerCase() : '';
    switch (k) {
      case 'seminar': return 'blue';
      case 'musik': return 'indigo';
      case 'workshop': return 'emerald';
      case 'pameran': return 'orange';
      default: return 'cyan';
    }
  }

  downloadCertificate(url: string, eventName: string) {
    this.presentToast(`Mengunduh sertifikat ${eventName}...`, 'success');
    const token = this.api.getToken();

    const downloadUrl = `${url}?token=${token}`;
    window.open(downloadUrl, '_system');
  }

  lihatSertifikatStatis(cert: any) {
    this.selectedCert = cert;
    this.isModalOpen = true;
  }

  tutupModal() {
    this.isModalOpen = false;
    this.selectedCert = null;
  }

  verifyCertificate() {
    const url = "https://eventin.financialcare.my.id/verify";

    window.open(url, "_blank");
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }
}
