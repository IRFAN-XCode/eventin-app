// import { Component, OnInit } from '@angular/core';
// import { ToastController, LoadingController } from '@ionic/angular';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Api } from '../../services/api';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-regist-organizer',
//   templateUrl: './regist-organizer.page.html',
//   styleUrls: ['./regist-organizer.page.scss'],
//   standalone: false,
// })
// export class RegistOrganizerPage implements OnInit {
//   registOrgForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private loadingCtrl: LoadingController,
//     private api: Api,
//     private router: Router,
//     private toastCtrl: ToastController
//   ) { }

//   ngOnInit() {
//     this.registOrganizer();
//   }

//   registOrganizer() {
//     this.registOrgForm = this.fb.group({
//       nama: ['', [Validators.required]],
//       nama_eo: ['', [Validators.required]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       password_confirmation: ['', [Validators.required]]
//     }, {
//       validator: this.passwordMatchValidator
//     });
//   }

//   passwordMatchValidator(g: FormGroup) {
//     return g.get('password')?.value === g.get('password_confirmation')?.value ? null : { 'mismatch': true };
//   }

//   async onRegistOrganizer() {
//     if (this.registOrgForm.invalid) {
//       this.presentToast('Harap isi form dengan benar.', 'danger');
//       return;
//     }

//     const loading = await this.loadingCtrl.create({
//       message: 'Sedang Proses...',
//     });
//     await loading.present();

//     this.api.registerOrganizer(this.registOrgForm.value).subscribe({
//       next: async (res: any) => {
//         await loading.dismiss();
//         if (res.success) {
//           this.presentToast(res.message, 'success');
//           this.registOrgForm.reset();
//           this.router.navigate(['/login-organizer']);
//         }
//       },
//       error: async (err: any) => {
//         await loading.dismiss();
//         let errorMessage = 'Terjadi kesalahan. Coba lagi..';
//         if (err.error && err.error.errors) {
//           const errors = err.error.errors;
//           errorMessage = errors[Object.keys(errors)[0]][0];
//         } else if (err.error && err.error.message) {
//           errorMessage = err.err.message;
//         }
//         this.presentToast(errorMessage, 'danger');
//       }
//     });
//   }

//   async presentToast(message: string, color: 'success' | 'danger') {
//     const toast = await this.toastCtrl.create({
//       message: message,
//       duration: 3000,
//       position: 'bottom',
//       color: color
//     });
//     await toast.present();
//   }
// } 

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  registOrgForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.registOrganizer();
  }

  registOrganizer() {
    this.registOrgForm = this.fb.group({
      nama: ['', [Validators.required]],
      nama_eo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      file_proposal: [null, [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator = (g: FormGroup) => {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.type !== 'application/pdf') {
        this.presentToast('File harus berupa format PDF.', 'danger');
        this.registOrgForm.patchValue({ file_proposal: null });
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.registOrgForm.patchValue({
        file_proposal: file
      });
    }
  }

  async onRegistOrganizer() {
    if (this.registOrgForm.invalid || !this.selectedFile) {
      this.presentToast('Harap isi form dan unggah proposal dengan benar.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Sedang memproses pendaftaran...',
    });
    await loading.present();

    // PROSES UTAMA: Bungkus data ke dalam FormData
    const formData = new FormData();
    formData.append('nama', this.registOrgForm.get('nama')?.value);
    formData.append('nama_eo', this.registOrgForm.get('nama_eo')?.value);
    formData.append('email', this.registOrgForm.get('email')?.value);
    formData.append('password', this.registOrgForm.get('password')?.value);
    formData.append('password_confirmation', this.registOrgForm.get('password_confirmation')?.value);
    formData.append('file_proposal', this.selectedFile); // Mengunggah file biner PDF asli

    // Kirim objek formData ke service API
    this.api.registerOrganizer(formData).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.presentToast(res.message, 'success');
          this.registOrgForm.reset();
          this.selectedFile = null;
          this.router.navigate(['/login-organizer']);
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        let errorMessage = 'Terjadi kesalahan. Coba lagi..';
        if (err.error && err.error.errors) {
          const errors = err.error.errors;
          errorMessage = errors[Object.keys(errors)[0]][0];
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        this.presentToast(errorMessage, 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }
}
