import { Injectable, inject } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private swPush = inject(SwPush);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Use the VAPID Public Key from backend .env
  readonly VAPID_PUBLIC_KEY = "BMoUGGyjMd9cngrUu7glrxPL0unt60bS59dyHBzEJGqWqP8KftbvYp87G5cGnkErF2WTE-hQqPTx7N1LHnvXzls";

  constructor() {
    this.swPush.messages.subscribe((message) => {
      console.log('Push message received', message);
    });

    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('Push notification clicked', notification);
      if (notification.data && notification.data.url) {
        this.router.navigateByUrl(notification.data.url);
      }
    });
  }

  async requestSubscription() {
    if (!this.swPush.isEnabled) {
      console.warn('Service Worker is not enabled or Push is not supported.');
      return;
    }

    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });
      console.log('Push Subscription object:', sub);
      
      // Send the subscription to the backend
      this.http.post(`${environment.apiUrl}/push/subscribe`, sub).subscribe({
        next: (res) => console.log('Successfully subscribed to push notifications', res),
        error: (err) => console.error('Failed to save subscription on backend', err)
      });
    } catch (err) {
      console.error('Could not subscribe to notifications', err);
    }
  }

  triggerGatheringAlert(lat: number, lng: number) {
    return this.http.post(`${environment.apiUrl}/gatherings/alert`, {
      title: '🚨 Rassemblement !',
      body: 'Un grand rassemblement a été signalé dans votre zone.',
      lat,
      lng
    });
  }
}
