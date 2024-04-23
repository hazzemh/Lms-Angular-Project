import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../firebase service/firebase.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService) {
    this.afAuth.authState.subscribe(user => {
      console.log(user);
    });
  }
  private loggedIn: boolean = false;


  register(email: string, password: string, role: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          return this.firebaseService.setUserData(user.uid, { email, role });
        } else {
          throw new Error('User registration failed');
        }
      }).catch(error => {
        console.error('Authentication error: ', error);
        throw error;
      });
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCurrentUser() {
    return this.afAuth.currentUser;
  }

  logout() {
    return this.afAuth.signOut();
  }


}