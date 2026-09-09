import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  phone: string;
  createdAt?: string;
  observationsCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Validate token with /me endpoint
      this.apiService.get<User>('/auth/me').subscribe({
        next: (res) => {
          if (res.success) {
            this.currentUser.set(res.data);
          } else {
            this.logout();
          }
        },
        error: () => this.logout()
      });
    }
  }

  login(phone: string, password: string) {
    return this.apiService.post<{user: User, token: string}>('/auth/login', { phone, password })
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            localStorage.setItem('auth_token', res.data.token);
            this.currentUser.set(res.data.user);
          }
        })
      );
  }

  register(name: string, phone: string, password: string) {
    return this.apiService.post<{user: User, token: string}>('/auth/register', { name, phone, password })
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            localStorage.setItem('auth_token', res.data.token);
            this.currentUser.set(res.data.user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
