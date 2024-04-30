import { Component } from '@angular/core';
import { AuthService } from './authentication service/auth.service';
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn().pipe(
      filter(isLoggedIn => isLoggedIn),
      switchMap(() => this.authService.getUserRole()),
      take(1)
    ).subscribe(role => this.redirectBasedOnRole(role));
  }

  private redirectBasedOnRole(role: string) {
    this.authService.getUserRole().subscribe(role => {
      switch (role) {
        case 'admin':
          this.router.navigate(['/admin-dashboard']);
          break;
        case 'instructor':
          this.router.navigate(['/instructor-dashboard']);
          break;
        case 'student':
          this.router.navigate(['/student-dashboard']);
          break;
        default:
          this.router.navigate(['/login']); // or any public default route
          break;
      }
    }, error => {
      console.log('Error getting user role:', error);
      this.router.navigate(['/login']);
    });
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
}
