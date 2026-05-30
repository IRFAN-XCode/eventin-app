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
      alamat: ['', Validators.required],
      
      // Step 2: Event
      nama_eo: ['', Validators.required],
      nama_event: ['', Validators.required],
      kategori_event: ['', Validators.required],
      deskripsi: ['', Validators.required],
      lokasi: ['', Validators.required],
      tgl_mulai: ['', Validators.required],
      tgl_berakhir: ['', Validators.required],
      
      // Step 3: Tiket & Kapasitas
      type_event: ['', Validators.required],
      seats: [false], 
      harga_reg: [''],
      harga_vip: [''],
      kapasitas_reg: [''],
      kapasitas_vip: [''],

      // Step 4: Akun & Keamanan
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { 
      validators: this.atLeastOnePriceValidator 
    });
  }

  // --- CUSTOM VALIDATOR HARGA TIKET ---
  atLeastOnePriceValidator(control: AbstractControl): ValidationErrors | null {
    const reg = control.get('harga_reg')?.value;
    const vip = control.get('harga_vip')?.value;
    
    if (!reg && !vip) {
      return { priceRequired: true };
    }
    return null;
  }

  // --- FUNGSI BANTUAN CEK VALIDASI PER STEP ---
  // Fungsi ini akan mengecek sekumpulan input, dan memicu efek "touched" agar pesan error (jika ada) muncul
  isStepValid(fields: string[]): boolean {
    let isValid = true;
    for (const field of fields) {
      const control = this.registerForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched(); // Menandai input merah jika disentuh
        isValid = false;
      }
    }
    return isValid;
  }

  // --- FUNGSI NAVIGASI STEP (DENGAN VALIDASI) ---
  nextStep() {
    // Validasi saat berada di Step 1
    if (this.currentStep === 1) {
      const fields = ['nama', 'email', 'nomor_handphone', 'alamat'];
      if (!this.isStepValid(fields)) {
        this.showToast('Mohon lengkapi semua Data Personal dengan benar.', 'warning');
        return; // Hentikan fungsi, jangan pindah step
      }
    } 
    
    // Validasi saat berada di Step 2
    else if (this.currentStep === 2) {
      const fields = ['nama_eo', 'nama_event', 'kategori_event', 'deskripsi', 'lokasi', 'tgl_mulai', 'tgl_berakhir'];
      if (!this.isStepValid(fields)) {
        this.showToast('Mohon lengkapi semua Informasi Event.', 'warning');
        return;
      }
      // Validasi File Upload secara terpisah
      if (!this.selectedImage || !this.selectedPdf) {
        this.showToast('Poster Event dan Proposal (PDF) wajib diunggah!', 'warning');
        return;
      }
    } 
    
    // Validasi saat berada di Step 3
    else if (this.currentStep === 3) {
      const fields = ['type_event'];
      if (!this.isStepValid(fields)) {
        this.showToast('Mohon pilih Jenis Pembayaran.', 'warning');
        return;
      }

      // Validasi Harga (Memanggil error dari Form Group Custom Validator)
      if (this.registerForm.errors?.['priceRequired']) {
        this.showToast('Mohon isi minimal satu Harga Tiket (Reguler atau VIP).', 'warning');
        return;
      }

      // Validasi Kapasitas jika Toggle Kursi (Seats) aktif
      const isSeatsActive = this.registerForm.get('seats')?.value;
      if (isSeatsActive) {
        const capReg = this.registerForm.get('kapasitas_reg')?.value;
        const capVip = this.registerForm.get('kapasitas_vip')?.value;
        
        // Memaksa admin mengisi kapasitas sesuai tiket yang diberi harga
        const hasHargaReg = !!this.registerForm.get('harga_reg')?.value;
        const hasHargaVip = !!this.registerForm.get('harga_vip')?.value;

        if ((hasHargaReg && !capReg) || (hasHargaVip && !capVip)) {
          this.showToast('Mohon isi Kapasitas Kursi untuk tiket yang Anda tentukan harganya.', 'warning');
          return;
        }
      }
    }

    // Jika semua validasi lolos, baru pindah ke step berikutnya
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // --- Fungsi File Upload ---
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

  // --- Fungsi Pengiriman Data (Step 4) ---
  async submitForm() {
    // Validasi akhir untuk Step 4 (Password)
    const fields = ['password', 'password_confirmation'];
    if (!this.isStepValid(fields)) {
      this.showToast('Mohon lengkapi Password Anda.', 'warning');
      return;
    }

    // Cek kecocokan password
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
        this.showToast('Registrasi Organizer dan Event Berhasil!', 'success');
        this.registerForm.reset();
        this.selectedImage = null;
        this.selectedPdf = null;
        this.currentStep = 1;
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        loading.dismiss();
        console.error('Error dari server:', err);
        const errorMessage = err.error?.message || 'Terjadi kesalahan saat mendaftar.';
        this.showToast(errorMessage, 'danger');
      }
    });
  
  }


  // ngOnInit() {
  //   this.registOrganizer();
  // }

  // registOrganizer() {
  //   this.registOrgForm = this.fb.group({
  //     nama: ['', [Validators.required]],
  //     nama_eo: ['', [Validators.required]],
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //     password_confirmation: ['', [Validators.required]],
  //     file_proposal: [null, [Validators.required]]
  //   }, {
  //     validator: this.passwordMatchValidator
  //   });
  // }

  // passwordMatchValidator = (g: FormGroup) => {
  //   return g.get('password')?.value === g.get('password_confirmation')?.value
  //     ? null : { 'mismatch': true };
  // }

  // onFileChange(event: any) {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];

  //     if (file.type !== 'application/pdf') {
  //       this.presentToast('File harus berupa format PDF.', 'danger');
  //       this.registOrgForm.patchValue({ file_proposal: null });
  //       this.selectedFile = null;
  //       return;
  //     }

  //     this.selectedFile = file;
  //     this.registOrgForm.patchValue({
  //       file_proposal: file
  //     });
  //   }
  // }

  // async onRegistOrganizer() {
  //   if (this.registOrgForm.invalid || !this.selectedFile) {
  //     this.presentToast('Harap isi form dan unggah proposal dengan benar.', 'danger');
  //     return;
  //   }

  //   const loading = await this.loadingCtrl.create({
  //     message: 'Sedang memproses pendaftaran...',
  //   });
  //   await loading.present();

  //   // PROSES UTAMA: Bungkus data ke dalam FormData
  //   const formData = new FormData();
  //   formData.append('nama', this.registOrgForm.get('nama')?.value);
  //   formData.append('nama_eo', this.registOrgForm.get('nama_eo')?.value);
  //   formData.append('email', this.registOrgForm.get('email')?.value);
  //   formData.append('password', this.registOrgForm.get('password')?.value);
  //   formData.append('password_confirmation', this.registOrgForm.get('password_confirmation')?.value);
  //   formData.append('file_proposal', this.selectedFile); // Mengunggah file biner PDF asli

  //   // Kirim objek formData ke service API
  //   this.api.registerOrganizer(formData).subscribe({
  //     next: async (res: any) => {
  //       await loading.dismiss();
  //       if (res.success) {
  //         this.presentToast(res.message, 'success');
  //         this.registOrgForm.reset();
  //         this.selectedFile = null;
  //         this.router.navigate(['/login-organizer']);
  //       }
  //     },
  //     error: async (err: any) => {
  //       await loading.dismiss();
  //       let errorMessage = 'Terjadi kesalahan. Coba lagi..';
  //       if (err.error && err.error.errors) {
  //         const errors = err.error.errors;
  //         errorMessage = errors[Object.keys(errors)[0]][0];
  //       } else if (err.error && err.error.message) {
  //         errorMessage = err.error.message;
  //       }
  //       this.presentToast(errorMessage, 'danger');
  //     }
  //   });
  // }

  // async presentToast(message: string, color: 'success' | 'danger') {
  //   const toast = await this.toastCtrl.create({
  //     message: message,
  //     duration: 3000,
  //     position: 'bottom',
  //     color: color
  //   });
  //   await toast.present();
  // }
}
