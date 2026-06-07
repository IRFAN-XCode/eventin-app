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

  getEventSeats(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/events/${id}/seats`)
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
    return this.http.post(`${environment.apiUrl}/regist-organizer`, data, {
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

    return this.http.post(`${environment.apiUrl}/checkout-manual`, formData, { headers });
  }

  getMyTickets(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return this.http.get(`${environment.apiUrl}/my-tickets`, { headers });
  }

  getDetailTicket(kodeTransaksi: string, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return this.http.get(`${environment.apiUrl}/detail-ticket/${kodeTransaksi}`, { headers });
  }

  getMyReward() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return this.http.get(`${environment.apiUrl}/reward`, { headers });
  }

  getNotifications() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return this.http.get(`${environment.apiUrl}/notification`, { headers });
  }

  getUnreadNotificationCount() {
    const token = this.getToken();
    const headers = new HttpHeaders({ 'Authorization': `${token}` });
    return this.http.get(`${environment.apiUrl}/notifications/unread-count`, { headers });
  }

  readNotifById(id: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ 'Authorization': `${token}`});
    return this.http.post(`${environment.apiUrl}/notifications/${id}`, {}, { headers });
  }

  markAllNotificationsAsRead() {
    const token = this.getToken();
    const headers = new HttpHeaders({ 'Authorization': `${token}` });
    return this.http.post(`${environment.apiUrl}/notifications/mark-all-read`, {}, { headers });
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

  getCertificate() {
    const token = this.getToken();
    const headers = new HttpHeaders({ 'Authorization' : `${token}`});
    return this.http.get(`${environment.apiUrl}/my-certificates`, { headers });
  }

  downloadCertificate(kodeTransaksi: string) {
    const token = this.getToken();
    return `${environment.apiUrl}/download-certificate/${kodeTransaksi}?token=${token}`;
  }

  verifyCertificate(certId: string) {
    return this.http.get(`${environment.apiUrl}/verify-certificate/${certId}`);
  }

}


