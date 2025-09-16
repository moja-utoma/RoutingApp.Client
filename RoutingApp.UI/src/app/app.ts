import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('RoutingApp.UI');

  constructor(private msalService: MsalService) {}

  ngOnInit() {
    this.msalService.instance.handleRedirectPromise().then(() => {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length === 0) {
        // No logged-in account → trigger login
        this.msalService.loginRedirect();
      } else {
        // Set the first account as active
        this.msalService.instance.setActiveAccount(accounts[0]);
      }
    });
  }
}
