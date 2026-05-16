import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(
    private http: HttpClient
  ) { }

  doLogin(email: string, password: string) {

    return this.http.post(environment.apiUrl + '/login', { 'email': email, 'password': password }), ({ responseType: 'json' });
  }

  getAllEvent(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/events`);
  }

  getEventById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/events/` + id);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, data, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }
}
