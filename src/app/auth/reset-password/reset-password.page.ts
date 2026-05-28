import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Api } from 'src/app/services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {

  email: string = '';
  currentStep: number = 1;
  isLoading: boolean = false;
  otpCode: string = '';
  passwordBaru: string = '';
  konfirmasiPassword: string = '';

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    private api: Api
  ) { }

  ngOnInit() {}

  kirimOtp() {
    if (!this.email) {
      this.presentToast('Masukkan email terlebih dahulu.', 'warning');
    }

    this.isLoading = true;
    this.api.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.presentToast(res.message, 'success');
          this.currentStep = 2;
        }
      },
      error: (err) => {
        this.isLoading = false;
        const message = err.error?.errors?.email?.[0] || err.error?.message || 'Terjadi kesalahan.';
        this.presentToast(message, 'danger');
      }
    });
  }

  verifikasiOtp() {
    if (!this.otpCode) {
      this.presentToast('Masukkan 6 digit Kode OTP.', 'warning');
      return;
    }

    this.isLoading = true;
    this.api.verifyOtp(this.email, Number(this.otpCode)).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.presentToast(res.message, 'success');
          this.currentStep = 3;
        }
      },
      error: (err) => {
        this.isLoading = false;
        const message = err.error?.message || 'Kode OTP tidak valid.';
        this.presentToast(message, 'danger');
      }
    });
  }

  gantiPassword() {
    if (this.passwordBaru.length < 6) {
      this.presentToast('Password minimal 6 karakter.', 'warning');
      return;
    }

    if  (this.passwordBaru !== this.konfirmasiPassword) {
      this.presentToast('Konfirmasi password tidak cocok.', 'warning');
      return;
    }

    this.isLoading = true;
    const payload = {
      email: this.email,
      otp: Number(this.otpCode),
      password: this.passwordBaru,
      password_confirmation: this.konfirmasiPassword
    };

    this.api.resetPassword(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.presentToast(res.message, 'success');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const message = err.error?.message || 'Gagal mereset password.';
        this.presentToast(message, 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000, color,
      position: 'top'
    });
  }
}
