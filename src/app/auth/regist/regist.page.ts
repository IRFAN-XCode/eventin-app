import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Api } from '../../services/api';

@Component({
  selector: 'app-regist',
  templateUrl: './regist.page.html',
  styleUrls: ['./regist.page.scss'],
  standalone: false,
})
export class RegistPage implements OnInit {
  registerForm!: FormGroup;

  // email: string = '';
  // password: string = '';
  // confirm_password: string = '';

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private api: Api,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.presentToast('Harap isi form dengan benar.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Mendaftarkan akun...',
    });
    await loading.present();

    this.api.register(this.registerForm.value).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.presentToast(res.message, 'success');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        let errorMsg = 'Terjadi kesalahan sistem.';
        if (err.error && err.error.errors) {
          const errors = err.error.errors;
          errorMsg = errors[Object.keys(errors)[0]][0];
        } else if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.presentToast(errorMsg, 'danger');
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

// regist() {
//   console.log("Yey, berhasil buat akun!")
//   this.navCtrl.navigateRoot('/login');
// }

