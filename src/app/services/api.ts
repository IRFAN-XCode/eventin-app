import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(
    private http: HttpClient
  ) { }

  refreshToken(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `${token}`
    });

    return this.http.post(`${environment.apiUrl}/refresh`, { headers });
  }

  getEvents(kategori?: string, search?: string): Observable<any> {
    let params = new HttpParams();
    
    if (kategori && kategori.trim() !== '') {
        params = params.set('kategori', kategori);
    }
    if (search && search.trim() !== '') {
      params = params.set('search', search);
    }

    return this.http.get(`${environment.apiUrl}/events`, { params });
  }

  getEventDetail(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/event-detail/${id}`);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, data, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, credentials, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  LoginOrganizer(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login-organizer`, data, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  onLogout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `${token}`
    });

    return this.http.post(`${environment.apiUrl}/logout`, {}, { headers });
  }

  registerOrganizer(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register-organizer`, data, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  saveToken(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getProfileUser(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `${token}`
    });

    return this.http.get(`${environment.apiUrl}/profile`, { headers });
  }

  updateProfile(data: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `${token}`
    });

    return this.http.put(`${environment.apiUrl}/profile/edit-profile`, data, { headers });
  }

  changePassword(data: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `${token}`
    });

    return this.http.put(`${environment.apiUrl}/change-password`, data, { headers });
  }

  deleteAccount(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `${token}`
    });
    return this.http.delete(`${environment.apiUrl}/profile/delete`, { headers });
  }

  Checkout(formData: FormData, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });

    return this.http.post(`${environment.apiUrl}/checkout-event`, formData, { headers });
  }

  getMyTickets(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return this.http.get(`${environment.apiUrl}/my-tickets`, { headers });
  }

  getDetailTicketManual(kodeTransaksi: string, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return this.http.get(`${environment.apiUrl}/detail-ticket/${kodeTransaksi}`, { headers });
  }

  getTiketDownload(kodeTransaksi: string) {
    const token = localStorage.getItem('token');
    return `${environment.apiUrl}/transactions/${kodeTransaksi}/download_pdf?=${token}`;
  }

  forgotPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/forgot-password`, { email });
  }

  verifyOtp(email: string, otp: number) {
    return this.http.post(`${environment.apiUrl}/verify-otp`, { email, otp });
  }

  resetPassword(data: any) {
    return this.http.post(`${environment.apiUrl}/reset-password`, data);
  }

}


