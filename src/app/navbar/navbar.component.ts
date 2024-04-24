import { Component } from '@angular/core';
import { AuthService } from '../authentication service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn$ = this.authService.isLoggedIn();
  userRole$ = this.authService.getUserRole();

  constructor(private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
}
