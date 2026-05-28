import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Api } from 'src/app/services/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-organizer',
  templateUrl: './login-organizer.page.html',
  styleUrls: ['./login-organizer.page.scss'],
  standalone: false,
})
export class LoginOrganizerPage implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private api: Api,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async loginOrganizer() {
    if (this.loginForm.invalid) {
      this.presentToast('Isi form dengan benar!.', 'danger')
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Memverifikasi akun...',
    });
    await loading.present();

    this.api.LoginOrganizer(this.loginForm.value).subscribe({
      next: async (res: any) => {
        await loading.dismiss();

        if (res.success) {
          this.api.saveToken(res.token, res.user);
          this.presentToast(res.message, 'success');
          this.loginForm.reset();

          if (res.user.role === 'organizer') {
            this.router.navigateByUrl('/events');
          } else if (res.user.role === 'user') {
            this.router.navigate(['/login-organizer']);
            this.presentToast('Anda tidak memiliki akses sebagai organizer', 'danger');
          }
        }
      },

      error: async (err: any) => {
        await loading.dismiss();
        let errorMsg = 'gagal terhubung ke server.';

        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        } else if (err.error && err.error.errors) {
          const errors = err.error.errors;
          errorMsg = errors[Object.keys(errors)[0]][0];
        }
        this.presentToast(errorMsg, 'danger');

      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

}
