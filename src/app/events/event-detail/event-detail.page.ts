import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: false,
})
export class EventDetailPage implements OnInit {

  EventDetail: any = null;
  IdEvent!: any;
  isLoading = false;

  constructor(
    private api: Api,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.IdEvent = this.route.snapshot.paramMap.get('id');

    if (this.IdEvent) {
      this.getEventbyId(this.IdEvent);
    } else {
      console.log('Event tidak ditemukan');
    }
  }

  getEventbyId(id: any) {
    this.isLoading = true;
    this.api.getEventDetail(id).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.EventDetail = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Gagal memuat daftar event:', err);
      }
    });
  }

}
