import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: false,
})
export class EventsPage implements OnInit {

  isLoading: boolean = false;
  ListEvent: any[] = [];
  kategoriAktif: string = '';
  keywordSearching: string = '';

  constructor(
    private api: Api,
    private toastCtrl : ToastController,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.kategoriAktif = params['kategori'] || '';
      this.keywordSearching = params['search'] || '';

      this.loadFilterEvent();
    });
  }

  onSearching(event: any) {
    const val = event.target.value;
    this.keywordSearching = val !== undefined && val !== null ? val : '';

    this.loadFilterEvent();
  }

  loadFilterEvent() {
    this.isLoading = true;

    this.api.getEvents(this.kategoriAktif, this.keywordSearching).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.ListEvent = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.presentToast('Gagal memuat daftar event', 'danger');
      }
    });
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

  resetFilter() {
    this.kategoriAktif = '';
    this.loadFilterEvent();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}
