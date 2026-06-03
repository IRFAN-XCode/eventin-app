import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Api } from 'src/app/services/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  returnUrl: string = '/home';

  showPassword: boolean = false;

  constructor(
    private api: Api,
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.presentToast('Harap isi email dan password dengan benar.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Memverifikasi akun...',
    });
    await loading.present();

    this.api.login(this.loginForm.value).subscribe({
      next: async (res: any) => {
        await loading.dismiss();

        if (res.success) {
          localStorage.setItem('FirstTime', 'false');
          this.api.saveToken(res.token, res.user);

          this.presentToast(res.message, 'success');
          this.loginForm.reset();

          if (res.user.role === 'user') {
            this.router.navigate(['/home']);
          } else if (res.user.role === 'organizer') {
            this.presentToast('Role Anda tidak sesuai.', 'warning');
          }
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        let errorMsg = 'Gagal terhubung ke server.';

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

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

}

