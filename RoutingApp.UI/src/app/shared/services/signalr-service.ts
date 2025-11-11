import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { envAuth0 } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private apiLink = envAuth0.audience;
  token: string = '';

  constructor(private authService: AuthService) {
    this.authService
      .getAccessTokenSilently({
        authorizationParams: {
          audience: envAuth0.audience,
          scope: 'read:current_user',
        },
      })
      .subscribe({
        next: (token) => {
          this.token = token;
        },
        error: err => console.error(err)
      });

      this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.apiLink + '/routeHub', {
              accessTokenFactory: () => this.token,
            })
            .withAutomaticReconnect()
            .build();

          this.hubConnection.onreconnected(() => {
            const savedId = localStorage.getItem('correlationId');
            if (savedId) {
              this.subscribeToRoute(savedId, (data) => {
                console.log('Route received after reconnection:', data);
              });
            }
          });
  }

  async startConnection(): Promise<void> {
    if (
      this.hubConnection.state === signalR.HubConnectionState.Connected ||
      this.hubConnection.state === signalR.HubConnectionState.Connecting
    ) {
      return;
    }

    try {
      await this.hubConnection.start();
      console.log('SignalR connected');
    } catch (err) {
      console.error('SignalR connection error:', err);
    }
  }

  subscribeToRoute(correlationId: string, callback: (data: any) => void): void {
    this.hubConnection
      .invoke('SubscribeToRoute', correlationId)
      .catch((err) => console.error('Subscription error:', err));

    this.hubConnection.off('ReceiveRoute');
    this.hubConnection.on('ReceiveRoute', callback);
  }
}
