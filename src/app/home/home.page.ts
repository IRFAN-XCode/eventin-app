import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
// import { HttpClient } from '@angular/common/http';

// interface LaravelResponse {
//   success: boolean;
//   message: string;
//   data: any[];
// }

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  ListEvent: any[] = [];

  constructor(
    private api: Api
    // private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadEvent();
  }

  loadEvent() {
    this.api.getAllEvent().subscribe((res: any) => {
      this.ListEvent = res.data; // Sesuaikan dengan struktur JSON dari Laravel
    });
  }

  // ionViewWillEnter() {
  //   this.getAllEvent();
  // }

  // getAllEvent() {
  //   this.http.get<LaravelResponse>(this.apiUrl).subscribe({
  //     next: (res) => {
  //       // Sekarang VS Code tahu 'res' punya 'data'
  //       this.AllEvent = res.data; 
  //     },
  //     error: (err) => {
  //       console.error('Error saat load data:', err);
  //     }
  //   });
  // }
}


