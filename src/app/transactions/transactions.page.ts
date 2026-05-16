import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  standalone: false,
})
export class TransactionsPage implements OnInit {
  currentStep: number = 1;

  // Flag dari Backend: Apakah event ini butuh milih seat? (misal: Seminar biasa = false)
  hasSeats: boolean = true;

  maxTickets: number = 1;

  // Data Kategori dari Backend
  categories = [
    { id: 1, name: 'VIP', price: 250000 },
    { id: 2, name: 'Reguler', price: 100000 }
  ];

  selectedCategory: any = null;
  ticketQuantity: number = 1;

  // Form Data (Bisa di-prefill jika user sudah login)
  formData = {
    nama_lengkap: '',
    email: '',
    nomor_handphone: '',
    tanggal_lahir: '',
    jenis_kelamin: 'Laki-laki'
  };

  // Data Kursi
  availableSeats: any[] = [];
  selectedSeats: any[] = [];

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (this.hasSeats) {
      this.generateMockSeats();
    }
  }

  // Menentukan step terakhir berdasarkan apakah event punya seat atau tidak
  get finalStep(): number {
    return this.hasSeats ? 4 : 3;
  }

  // --- LOGIKA STEP 1 (KATEGORI) ---
  selectCategory(category: any) {
    if (this.selectedCategory?.id !== category.id) {
      this.selectedCategory = category;
      this.ticketQuantity = 1;
      this.selectedSeats = []; // Reset kursi jika ganti kategori
      this.availableSeats.forEach(s => s.selected = false);
    }
  }

  increaseQty(event: Event) {
    event.stopPropagation();

    // Validasi batas maksimal tiket
    if (this.ticketQuantity < this.maxTickets) {
      this.ticketQuantity++;
    } else {
      alert(`Maksimal pembelian adalah ${this.maxTickets} tiket per transaksi.`);
    }
  }

  decreaseQty(event: Event) {
    event.stopPropagation();
    if (this.ticketQuantity > 1) {
      this.ticketQuantity--;
      // Jika kursi yang dipilih melebihi kuantitas baru, reset kursi
      if (this.selectedSeats.length > this.ticketQuantity) {
        this.selectedSeats = [];
        this.availableSeats.forEach(s => s.selected = false);
      }
    }
  }

  // Getter untuk menghitung total harga
  get totalPrice(): number {
    if (!this.selectedCategory) return 0;
    return this.selectedCategory.price * this.ticketQuantity;
  }

  // --- LOGIKA STEP 3 (KURSI) ---
  generateMockSeats() {
    const rows = ['A', 'B'];
    rows.forEach(row => {
      for (let i = 1; i <= 10; i++) {
        this.availableSeats.push({
          id: `${row}${i}`,
          label: `${row}${i}`,
          is_booked: i === 2 || i === 4, // Simulasi kursi yang sudah dibeli orang
          selected: false
        });
      }
    });
  }

  toggleSeat(seat: any) {
    if (seat.is_booked) return;

    if (seat.selected) {
      // Batal pilih
      seat.selected = false;
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      // Pilih kursi (Validasi: tidak boleh lebih dari jumlah tiket)
      if (this.selectedSeats.length < this.ticketQuantity) {
        seat.selected = true;
        this.selectedSeats.push(seat);
      } else {
        alert(`Anda hanya membeli ${this.ticketQuantity} tiket.`);
      }
    }
  }

  getSelectedSeatsString(): string {
    return this.selectedSeats.map(s => s.label).join(', ');
  }

  // --- LOGIKA NAVIGASI STEP ---
  nextStep() {
    // Validasi sebelum lanjut step
    if (this.currentStep === 1 && !this.selectedCategory) {
      alert('Silakan pilih kategori tiket terlebih dahulu!');
      return;
    }

    if (this.currentStep === 3 && this.hasSeats && this.selectedSeats.length < this.ticketQuantity) {
      alert(`Silakan pilih ${this.ticketQuantity} kursi!`);
      return;
    }

    if (this.currentStep < this.finalStep) {
      this.currentStep++;
    }
  }

  // submitTransaction() {


  //   console.log('Mengirim data ke Laravel API...', finalPayload);
  //   alert('Simulasi Transaksi Berhasil! Mengeksekusi pembuatan QR Code...');
  //   // TODO: HttpClient POST request ke Laravel
  // }

  async submitTransaction() {
    const finalPayload = {
      category_id: this.selectedCategory.id,
      quantity: this.ticketQuantity,
      customer_data: this.formData,
      seats: this.selectedSeats.map(s => s.id),
      total_amount: this.totalPrice
    };

    const alert = await this.alertController.create({
      header: 'Pembayaran Sukses',
      message: 'Klik Ok untuk melihat detail tiket',
      cssClass: 'bg-alert',
      buttons: [{
        text: 'Ok',
        role: 'confirm',
        cssClass: 'primary',
        handler: () => {
          this.navCtrl.navigateBack('/my-tickets/detail-ticket');
        },
      }],
    });

    await alert.present();
  }
}