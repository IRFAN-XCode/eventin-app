import { Component, OnInit } from '@angular/core';
import { Api } from 'src/app/services/api';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage implements OnInit {

  userDetailforEdit: any;

  editProfileForm!: FormGroup;

  constructor(
    private api: Api,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.validateForm();
    this.loadDataUserDetail();
  }

  validateForm() {
    this.editProfileForm = this.fb.group({
      nama: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nomor_handphone: ['', Validators.required],
      jenis_kelamin: ['', Validators.required]
    });
  }

  async loadDataUserDetail() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();

    this.api.getProfileUser().subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.userDetailforEdit = res.data;

          this.editProfileForm.patchValue({
            nama: this.userDetailforEdit.nama,
            email: this.userDetailforEdit.email,
            nomor_handphone: this.userDetailforEdit.nomor_handphone,
            jenis_kelamin: this.userDetailforEdit.jenis_kelamin
          });
        }
      },
      error: async (err) => {
        await loading.dismiss();
        let errorMsg = 'Gagal memuat data.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.presentToast(errorMsg, 'danger');
      }
    });
  }

  async onUpdate() {
    if (this.editProfileForm.invalid) {
      this.presentToast('Harap isi form dengan benar.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Menyimpan perubahan...',
    });
    await loading.present();

    this.api.updateProfile(this.editProfileForm.value).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          this.presentToast('Profil berhasil diperbarui!', 'success');
          this.api.saveToken(this.api.getToken()!, res.data);
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        let errorMsg = 'Gagal mengupdate profile.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
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
