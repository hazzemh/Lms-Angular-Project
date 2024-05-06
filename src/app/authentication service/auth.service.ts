import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '@angular/fire/auth';
import firebase from 'firebase/compat/app';
import { UserDocument } from '../models/userDoc.model';


interface UserData {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isUserLoggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string>('');

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.monitorAuthState();
  }

  private monitorAuthState(): void {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.fetchCurrentUserRole(user.uid).pipe(
            tap(userRole => {
              this.userRole.next(userRole);
              this.isUserLoggedIn.next(true);
            })
          );
        } else {
          this.isUserLoggedIn.next(false);
          this.userRole.next('');
          return EMPTY;
        }
      })
    ).subscribe();
  }

  fetchCurrentUserRole(uid: string): Observable<string> {
    return this.firestore.collection<UserDocument>('users').doc<UserDocument>(uid).valueChanges().pipe(
      map(userDoc => {
        if (userDoc) {
          return userDoc.role;
        } else {
          throw new Error('User document does not exist');
        }
      })
    );
  }

  private fetchUserRole(userId: string): void {
    this.firestore.collection<UserData>('users').doc(userId).valueChanges().subscribe({
      next: (userData) => {
        if (userData && userData.role) {
          this.userRole.next(userData.role);
        } else {
          console.error('User data or role is missing');
          this.userRole.next('');
        }
      },
      error: (error) => {
        console.error('Error fetching user role:', error);
        this.userRole.next('');
      }
    });
  }

  register(email: string, password: string, name: string, role: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          return this.firestore.collection('users').doc(user.uid).set({
            email: email,
            name: name,
            role: role,
            status: "inactive"
          }).then(() => {
            return this.afAuth.signOut();
          });
        } else {
          throw new Error('User registration failed');
        }
      })
      .catch(error => {
        console.error('Authentication error: ', error);
        throw error;
      });
  }
  

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }

  getUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  getCurrentUser(): Promise<User | null> {
    return this.afAuth.currentUser as Promise<User | null>;
  }

  getCurrentUserObservable(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  getCurrentStudentObservable(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map(user => user ? user.uid : null)
    );
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.isUserLoggedIn.next(false);
      this.userRole.next('');
      this.router.navigate(['/login']);
    });
  }
}
