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

interface ChatResponse {
  message: string;
  timestamp: string;
  conversationId: string;
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
  conversationId: string = '';
  userInput = '';
  loading = false;
  error = '';
  private apiUrl = 'https://routing-app-ubuntu.azurewebsites.net/api/chat'; //localhost:7136

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userName = user?.name ?? 'Невідомий користувач';
    });

    const storedId = localStorage.getItem('conversationId');
    if (storedId) {
      this.conversationId = storedId;
    }

    this.loadHistory();
  }

  async loadHistory() {
    if (!this.conversationId) return;

    try {
      const token = await this.auth.getAccessTokenSilently();
      console.log(token);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get<ChatHistoryResponse>(`${this.apiUrl}/history?conversationId=${this.conversationId}`, { headers }).subscribe({
        next: (response) => {
          this.messages = response.history.filter((m) => m.role !== 'system');
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
      const token = await this.auth.getAccessTokenSilently().subscribe((token) => {
        console.log(token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http
          .post<ChatResponse>(
            `${this.apiUrl}/message`,
            {
              message,
              conversationId: this.conversationId,
            },
            { headers }
          )
          .subscribe({
            next: (response) => {
              console.log(response);
              this.messages.push({ role: 'assistant', content: response.message });
              this.loading = false;

              if (!this.conversationId) {
                this.conversationId = response.conversationId;
                localStorage.setItem('conversationId', this.conversationId);
              }
            },
            error: (err) => {
              this.error = err.error?.message || 'Failed to send message';
              this.messages = this.messages.slice(0, -1);
              this.loading = false;
            },
          });
      });
    } catch (err) {
      this.error = 'Authorization failed';
      this.messages = this.messages.slice(0, -1);
      this.loading = false;
    }
  }

  async clearHistory() {
    if (!this.conversationId || this.loading) return;

    this.loading = true;
    this.error = '';
    this.userInput = '';
    this.messages = [];

    try {
      const token = await this.auth.getAccessTokenSilently();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http
        .post(`${this.apiUrl}/clear?conversationId=${this.conversationId}`, null, { headers })
        .subscribe({
          next: () => {
            this.conversationId = '';
            localStorage.removeItem('conversationId');
            this.messages = [];
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to clear history:', err);
            this.error = 'Failed to clear chat history';
            this.loading = false;
          },
        });
    } catch (err) {
      console.error('Token retrieval failed:', err);
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
