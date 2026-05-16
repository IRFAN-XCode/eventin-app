import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false,
})
export class EventsPage implements OnInit {

  ListEvent: any[] = [];
  constructor(
    private api: Api
  ) { }

  ngOnInit() {
    // this.loadEvent();
  }

  loadEvent() {
    this.api.getAllEvent().subscribe((res: any) => {
      this.ListEvent = res.data; // Sesuaikan dengan struktur JSON dari Laravel
    });
  }
}
