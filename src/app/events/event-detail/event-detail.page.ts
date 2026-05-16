import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: false,
})
export class EventDetailPage implements OnInit {

  EventDetail: any[] = [];
  IdEvent: any;

  constructor(
    private api: Api
  ) { }

  ngOnInit() {
    // this.getEventbyId(this.IdEvent);
  }

  // getEventbyId(id: any) {
  //   this.api.getEventById(id).subscribe((res: any) => {
  //     this.EventDetail = res.data; // Sesuaikan dengan struktur JSON dari Laravel
  //   });
  // }

}
