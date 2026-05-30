import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Api } from '../services/api';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  standalone: false,
})
export class TransactionsPage implements OnInit {

  idEvent!: any;
  eventDetail: any = null;
  isLoading: boolean = false;

  jenisTiket: string = '';
  nomorKursi: string = '';
  daftarKursi: string[] = [];
  kursiTerbeli: string[] = [];

  currentStep: number = 1;
  finalStep: number = 3;
  hasSeats: boolean = false;

  formData: any = {
    nama_lengkap: '',
    email: '',
    nomor_handphone: '',
    jenis_kelamin: ''
  };

  bankPengirim: string = '';
  atasNama: string = '';
  selectedFile: File | null = null;

  searchQuery: string = '';
  seatsFiltered: string[] = [];

  constructor(
    private api: Api,
    private router: Router,
    private toastctrl: ToastController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idEvent = this.route.snapshot.paramMap.get('id');
    if (this.idEvent) {
      this.loadEventDetail();
      this.loadUserProfile();
    }
  }

  loadUserProfile() {
    this.api.getProfileUser().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.formData.nama_lengkap = res.data.nama;
          this.formData.email = res.data.email;
          this.formData.nomor_handphone = res.data.nomor_handphone;
          this.formData.jenis_kelamin = res.data.jenis_kelamin;
        }
      }
    });
  }

  isProfileInvalid(): boolean {
    return !this.formData.nama_lengkap ||
           !this.formData.email ||
           !this.formData.nomor_handphone ||
           !this.formData.jenis_kelamin;
  }

  loadEventDetail() {
    this.isLoading = true;
    this.idEvent = this.route.snapshot.paramMap.get('id');

    this.api.getEventDetail(this.idEvent).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.eventDetail = res.data;
          if (res.data.transactions && res.data.transactions.length > 0) {
            this.kursiTerbeli = res.data.transactions.map((trx: any) => trx.nomor_kursi);
          } else {
            this.kursiTerbeli = [];
          }
          
          this.hasSeats = Number(this.eventDetail.seats) === 1 || this.eventDetail.seats === true;
          this.finalStep = this.hasSeats ? 4 : 3;

          this.generateSeats();
        }
      }
    });
  }

  generateSeats() {
    this.nomorKursi = '';
    this.daftarKursi = [];

    const totalKapasitas = this.jenisTiket === 'vip' ? this.eventDetail.kapasitas_vip : this.eventDetail.kapasitas_reg;
    const kodeKursi = this.jenisTiket === 'vip' ? 'VIP-' : 'REG-';

    for (let i = 1; i <= totalKapasitas; i++) {
      this.daftarKursi.push(kodeKursi + i);
    }

    this.filterKursi();
  }

  filterKursi() {
    if (!this.searchQuery.trim()) {
      this.seatsFiltered = [...this.daftarKursi];
    } else {
      const keyword = this.searchQuery.trim().toLowerCase();
      this.seatsFiltered = this.daftarKursi.filter(kursi => kursi.toLowerCase().includes(keyword))
    };
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterKursi();
  }

  kursiDisabled(kursi: string): boolean {
    if (!this.kursiTerbeli || this.kursiTerbeli.length === 0) {
      return false;
    }

    return this.kursiTerbeli.some(kt =>kt && kt.toString().trim().toLowerCase() === kursi.trim().toLowerCase());
  }

  setKategoriTiket(kategori: string) {
    this.jenisTiket = kategori;
    this.onCategoryChange();
  }

  onCategoryChange() {
    this.generateSeats();
  }

  pilihKursi(kursi: string) {
    this.nomorKursi = kursi;
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.jenisTiket) {
        this.presentToast('Pilih Kategori tiket terlebih dahulu.', 'warning');
        return;
      }
      this.currentStep = this.hasSeats ? 2 : 2;
    } else if (this.currentStep === 2 && this.hasSeats) {
      if (!this.nomorKursi) {
        this.presentToast('Silahkan pilih nomor kursi terlebih dahulu', 'warning');
        return;
      }
      this.currentStep = 3;
    } else {
      if (this.isProfileInvalid()) {
        this.presentToast('Harap lengkapi data profil Anda terlebih dahulu!', 'danger');
        return;
      }
      this.currentStep = this.finalStep;
    }
  }

  previousStep() {
    this.currentStep -= 1;
    return;
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  async submitPembayaranManual() {
    if (!this.selectedFile || !this.bankPengirim || !this.atasNama) {
      this.presentToast('Harap melengkapi semua isian data form dan foto bukti bayar!', 'warning');
      return;
    }

    if (this.isProfileInvalid()) {
      this.presentToast('Gagal memproses. Data profil Anda terdeteksi belum lengkap!', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Mengunggah berkas transaksi ke admin...'
    });
    await loading.present();

    const formDataPayload = new FormData();
    formDataPayload.append('event_id', this.idEvent);
    formDataPayload.append('jenis_tiket', this.jenisTiket);
    formDataPayload.append('nomor_kursi', this.hasSeats ? this.nomorKursi : '');
    formDataPayload.append('bank_pengirim', this.bankPengirim);
    formDataPayload.append('atas_nama', this.atasNama);
    formDataPayload.append('bukti_pembayaran', this.selectedFile, this.selectedFile.name);

    const token = localStorage.getItem('token');

    this.api.Checkout(formDataPayload, token).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.presentToast(res.message, 'success');
          this.router.navigate(['/my-tickets']); 
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        this.presentToast(err.error?.message || 'Gagal mengirim berkas pembayaran.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastctrl.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

}
