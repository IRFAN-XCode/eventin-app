import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  ListEvent: any[] = [];
  isLoading = false;
  unreadCount: number = 0;

  constructor(
    private api: Api,
    private router : Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadEvent();

    const token = this.api.getToken();
    if (token) {
      this.loadUnreadCount();
    }
  }

  loadEvent() {
    this.isLoading = true;
    this.api.getEvents().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.ListEvent = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Gagal memuat daftar event:', err);
      }
    });
  }

  loadUnreadCount() {
    this.api.getUnreadNotificationCount().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.unreadCount = res.unread_count;
        }
      },
      error: (err) => console.error(err)
    });
  }

  doRefresh(event: any) {
    this.api.getEvents().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.ListEvent = res.data;
        }
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  getEventByKategori(namaKategori: string) {
    this.router.navigate(['events'], {
      queryParams: { kategori: namaKategori }
    });
  }

  onSearch(event: any) {
    const keyword = event.target.value;

    if (keyword && keyword.trim() !== '') {
      this.router.navigate(['/events'], {
        queryParams: {search: keyword}
      });
    }
  }

}


