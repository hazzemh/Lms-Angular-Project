import { Component } from '@angular/core';
import { AuthService } from './authentication service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public authService: AuthService) { }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
}
