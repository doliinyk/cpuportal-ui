import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);
  public readonly onAuthChange = new BehaviorSubject<boolean>(!!this.token);

  public get token() {
    return localStorage.getItem('token');
  }

  public isAuthenticated() {
    return !!this.token;
  }

  public register(credentials: Credentials) {
    return this.http
      .post<string>('/api/auth/register', credentials)
      .pipe(
        tap(() =>
          this.snackBarService.open('You have been registered', 'Close')
        )
      );
  }

  public login({ username, password }: Credentials) {
    return this.http
      .post<{ token: string }>(
        '/api/auth/login',
        {},
        {
          headers: {
            Authorization: 'Basic ' + btoa(`${username}:${password}`),
          },
        }
      )
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('token', token);
          this.onAuthChange.next(true);
          this.snackBarService.open('You have been logged in', 'Close');
        })
      );
  }

  public logout() {
    this.router.navigate(['']);
    localStorage.removeItem('token');
    this.onAuthChange.next(false);
    this.snackBarService.open('You have been logged out', 'Close');
  }
}
