import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Api } from '../../services/api';

@Component({
  selector: 'app-regist-organizer',
  templateUrl: './regist-organizer.page.html',
  styleUrls: ['./regist-organizer.page.scss'],
  standalone: false,
})
export class RegistOrganizerPage implements OnInit {
  currentStep: number = 1;
  registerForm!: FormGroup;

  selectedImage: File | null = null;
  selectedPdf: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private api: Api 
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      // Step 1: Personal
      nama: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nomor_handphone: ['', Validators.required],
      
      // Step 2: Event
      nama_eo: ['', Validators.required],
      nama_event: ['', Validators.required],
      kategori_event: ['', Validators.required],
      deskripsi: ['', Validators.required],
      lokasi: ['', Validators.required],
      waktu: ['', Validators.required],
      tgl_mulai: ['', Validators.required],
      tgl_berakhir: [''], // ✅ Dihidupkan kembali (tidak di-comment) agar tidak bikin macet step 2
      
      // Step 3: Tiket
      type_event: ['', Validators.required],
      opsi_tiket: ['', Validators.required],
      seats: [false], 
      harga_reg: [''],
      harga_vip: [''],
      kapasitas_reg: [''],
      kapasitas_vip: [''],

      // Step 4: Akun
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { 
      validators: this.dynamicPriceValidator 
    });
  }

  showReguler(): boolean {
    const opsi = this.registerForm.get('opsi_tiket')?.value;
    return opsi === 'reg' || opsi === 'both';
  }

  showVip(): boolean {
    const opsi = this.registerForm.get('opsi_tiket')?.value;
    return opsi === 'vip' || opsi === 'both';
  }

  dynamicPriceValidator(control: AbstractControl): ValidationErrors | null {
    const opsi = control.get('opsi_tiket')?.value;
    const typeEvent = control.get('type_event')?.value;
    
    if (!opsi || typeEvent === 'unpaid') return null; // Jika gratis, abaikan validasi harga wajib isi

    const regValue = control.get('harga_reg')?.value;
    const vipValue = control.get('harga_vip')?.value;
    
    const isRegEmpty = regValue === null || regValue === undefined || regValue.toString().trim() === '';
    const isVipEmpty = vipValue === null || vipValue === undefined || vipValue.toString().trim() === '';

    if (opsi === 'reg' && isRegEmpty) {
      return { priceRequiredError: 'Harga Reguler wajib diisi' };
    }
    if (opsi === 'vip' && isVipEmpty) {
      return { priceRequiredError: 'Harga VIP wajib diisi' };
    }
    if (opsi === 'both' && (isRegEmpty || isVipEmpty)) {
      return { priceRequiredError: 'Harga Reguler dan VIP wajib diisi' };
    }

    return null;
  }

  isStepValid(fields: string[]): boolean {
    let isValid = true;
    for (const field of fields) {
      const control = this.registerForm.get(field);
      if (control) {
        if (control.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      }
    }
    return isValid;
  }

  nextStep() {
    if (this.currentStep === 1) {
      const fields = ['nama', 'email', 'nomor_handphone']; // ✅ Menghapus 'alamat' karena di HTML tidak ada input alamat
      if (!this.isStepValid(fields)) {
        this.showToast('Mohon lengkapi semua Data Personal dengan benar.', 'warning');
        return;
      }
    } 
    
    else if (this.currentStep === 2) {
      const fields = ['nama_eo', 'nama_event', 'kategori_event', 'deskripsi', 'lokasi', 'waktu', 'tgl_mulai', 'tgl_berakhir'];
      if (!this.isStepValid(fields)) {
        this.showToast('Mohon lengkapi semua Informasi Event.', 'warning');
        return;
      }

      const tglMulai = this.registerForm.get('tgl_mulai')?.value;
      const tglBerakhir = this.registerForm.get('tgl_berakhir')?.value;
      
      if (tglMulai && tglBerakhir) {
        const start = new Date(tglMulai);
        const end = new Date(tglBerakhir);
        if (end < start) {
          this.showToast('Tanggal berakhir tidak boleh lebih cepat dari tanggal mulai.', 'warning');
          return;
        }
      }

      if (!this.selectedImage || !this.selectedPdf) {
        this.showToast('Poster Event dan Proposal (PDF) wajib diunggah!', 'warning');
        return;
      }
    } 
    
    else if (this.currentStep === 3) {
      const fields = ['type_event', 'opsi_tiket'];
      if (!this.isStepValid(fields)) {
        this.showToast('Mohon pilih Jenis Pembayaran dan Kategori Tiket.', 'warning');
        return;
      }

      if (this.registerForm.errors?.['priceRequiredError']) {
        const errorMsg = this.registerForm.errors['priceRequiredError'];
        this.showToast(errorMsg, 'warning');
        return;
      }

      const capReg = this.registerForm.get('kapasitas_reg')?.value;
      const capVip = this.registerForm.get('kapasitas_vip')?.value;
      
      if (this.showReguler() && !capReg) {
        this.showToast('Mohon isi Kapasitas / Kuota untuk tiket Reguler.', 'warning');
        return;
      }
      if (this.showVip() && !capVip) {
        this.showToast('Mohon isi Kapasitas / Kuota untuk tiket VIP.', 'warning');
        return;
      }
    }

    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPdf = file;
    }
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  async submitForm() {
    const fields = ['password', 'password_confirmation'];
    if (!this.isStepValid(fields)) {
      this.showToast('Mohon lengkapi Password Anda.', 'warning');
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.password_confirmation) {
      this.showToast('Password dan Konfirmasi Password tidak cocok!', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Mendaftarkan Event Organizer...',
      spinner: 'crescent'
    });
    await loading.present();

    const formData = new FormData();
    
    Object.keys(this.registerForm.controls).forEach(key => {
      let value = this.registerForm.get(key)?.value;
      if (key === 'seats') value = value ? '1' : '0';
      if (value === null || value === undefined) value = '';
      formData.append(key, value);
    });

    formData.append('gambar_event', this.selectedImage as File); 
    formData.append('file_proposal', this.selectedPdf as File);

    this.api.registerOrganizer(formData).subscribe({
      next: (res: any) => {
        loading.dismiss();
        if (res.success) {
          this.showToast('Registrasi Organizer dan Event Berhasil!', 'success');
          this.registerForm.reset();
          this.selectedImage = null;
          this.selectedPdf = null;
          this.currentStep = 1;
          this.router.navigate(['/account']);
        }
      },
      error: (err: any) => {
        loading.dismiss();
        console.error('Error dari server:', err);
        const errorMessage = err.error?.message || 'Terjadi kesalahan saat mendaftar.';
        this.showToast(errorMessage, 'danger');
      }
    });
  }
}
