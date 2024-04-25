import { Component } from '@angular/core';
import { AuthService } from '../authentication service/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn$!: Observable<boolean>;
  userRole$!: Observable<string | null>;
  
  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.userRole$ = this.authService.getUserRole();
  }

  logout(): void {
    this.authService.logout();
  }
}
