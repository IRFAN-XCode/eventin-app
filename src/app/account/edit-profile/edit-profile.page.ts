import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage implements OnInit {

  nama_lengkap: string = '';
  email: string = '';
  nomor_handphone: string = '';
  jenis_kelamin: string = '';

  constructor() { }

  ngOnInit() {
  }

  editProfile() {
    console.log(this.nama_lengkap, this.email, this.nomor_handphone, this.jenis_kelamin);
  }
}
