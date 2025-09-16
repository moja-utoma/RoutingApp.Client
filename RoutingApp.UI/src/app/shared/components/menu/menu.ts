import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MatSidenavModule, MatListModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  constructor(private msalService: MsalService) {}

  logoutLocal() {

   this.msalService.logoutRedirect();
    // this.msalService.instance.setActiveAccount(null);

    // sessionStorage.clear();
    // localStorage.clear();

    //this.router.navigate(['/login']);
  }
}
