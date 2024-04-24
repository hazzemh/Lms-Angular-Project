import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './app/authentication service/auth.service';
import { FirebaseService } from './app/firebase service/firebase.service';

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
    try {
      const user = await this.authService.getCurrentUser();

      if (!user) {
        this.router.navigate(['/login']);
        return false;
      }

      const role = await this.firebaseService.getUserRole(user.uid);
      if (role === expectedRole) {
        return true;
      } else {
        this.router.navigate(['/unauthorized']); 
        return false;
      }
    } catch (error) {
      console.error('Error during authorization:', error);
      this.router.navigate(['/error']);
      return false;
    }
  }
}
