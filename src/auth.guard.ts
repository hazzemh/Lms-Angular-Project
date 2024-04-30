import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './app/authentication service/auth.service';
import { FirebaseService } from './app/firebase service/firebase.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const expectedRole = route.data['expectedRole'];
  
    const isLoggedIn = await this.authService.isLoggedIn().pipe(take(1)).toPromise();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
  
    const role = await this.authService.getUserRole().pipe(take(1)).toPromise();
    if (role === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
  
}
