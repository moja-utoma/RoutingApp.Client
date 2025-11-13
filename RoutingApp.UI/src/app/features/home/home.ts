import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
//import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { concatMap, map, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatHistoryResponse {
  history: Message[];
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  userName: string | undefined = undefined;
  messages: Message[] = [];
  userInput = '';
  loading = false;
  error = '';
  private apiUrl = 'https://routing-app-ubuntu.azurewebsites.net/api/chat';

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userName = user?.name ?? 'Невідомий користувач';
    });
        this.loadHistory();
  }

  async loadHistory() {
    try {
      const token = await this.auth.getAccessTokenSilently();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get<ChatHistoryResponse>(`${this.apiUrl}/history`, { headers }).subscribe({
        next: (response) => {
          this.messages = response.history.filter(m => m.role !== 'system');
        },
        error: (err) => {
          console.error('Failed to load history:', err);
        },
      });
    } catch (err) {
      console.error('Token retrieval failed:', err);
    }
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    this.error = '';
    const message = this.userInput;
    this.userInput = '';

    this.messages.push({ role: 'user', content: message });
    this.loading = true;

    try {
      const token = await this.auth.getAccessTokenSilently();
      console.log(token)
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http
        .post<{message:string; timestamp:string}>(`${this.apiUrl}/message`, { message })
        .subscribe({
          next: (response) => {
            console.log(response)
            this.messages.push({ role: 'assistant', content: response.message });
            this.loading = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to send message';
            this.messages = this.messages.slice(0, -1);
            this.loading = false;
          },
        });
    } catch (err) {
      this.error = 'Authorization failed';
      this.messages = this.messages.slice(0, -1);
      this.loading = false;
    }
  }

  //constructor(private msalService: MsalService) {}

  // ngOnInit() {
  //   const accounts: AccountInfo[] = this.msalService.instance.getAllAccounts();
  //   if (accounts.length > 0) {
  //     this.userName = accounts[0].name; // User's display name
  //   }
  // }
}
