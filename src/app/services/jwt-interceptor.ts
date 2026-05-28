import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Api } from './api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private api: Api,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      const user = JSON.parse(userData);
      const now = Math.floor(Date.now() / 1000);

      if (user.exp && (user.exp - now) < 300) {
        return this.handleTokenRefresh(request, next);
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }

  private handleTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.api.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;

          if (res.success) {
            this.api.saveToken(res.token, res.user);
            this.refreshTokenSubject.next(res.token);

            return next.handle(this.addTokenHeader(request, res.token));
          }

          this.handleUnauthorized();
          return throwError(() => new Error('Token refresh failed'));
        }),

        catchError((err) => {
          this.isRefreshing = false;
          this.handleUnauthorized();
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: token
      }
    });
  }

  private handleUnauthorized() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
