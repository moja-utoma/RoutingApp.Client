import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { concatMap, map, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  userName: string | undefined = undefined;

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userName = user?.name ?? 'Невідомий користувач';
    });
  }

  // constructor(private msalService: MsalService) {}

  // ngOnInit() {
  //   const accounts: AccountInfo[] = this.msalService.instance.getAllAccounts();
  //   if (accounts.length > 0) {
  //     this.userName = accounts[0].name; // User's display name
  //   }
  //}
}
