import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  userName: string | undefined = undefined;

  constructor(private msalService: MsalService) {}

  ngOnInit() {
    const accounts: AccountInfo[] = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.userName = accounts[0].name; // User's display name
    }
  }
}
