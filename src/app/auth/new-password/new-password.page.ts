import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from 'src/app/services/api';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
  standalone: false,
})
export class NewPasswordPage implements OnInit {

  ChangePasswordForm!: FormGroup;

  constructor(
    private api: Api,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initNewPassword();
  }

  initNewPassword() {
    this.ChangePasswordForm = this.fb.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      new_password_confirmation: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('new_password')?.value;
    const confirmPassword = g.get('new_password_confirmation')?.value;

    return newPassword === confirmPassword ? null : { 'mismatch': true };
  }

  async onUpdatePassword() {
    if (this.ChangePasswordForm.invalid) {
      this.presentToast('Harap isi form dengan benar', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Menyimpan perubahan..',
    });
    await loading.present();

    this.api.changePassword(this.ChangePasswordForm.value).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.presentToast('Password berhasil diperbarui!', 'success');
          this.ChangePasswordForm.reset();
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        let errorMsg = 'Gagal mengubah password.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        } else if (err.error && err.err.errors) {
          const errors = err.err.errors;
          errorMsg = errors[Object.keys(errors)[0]][0];
        }
        this.presentToast(errorMsg, 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
