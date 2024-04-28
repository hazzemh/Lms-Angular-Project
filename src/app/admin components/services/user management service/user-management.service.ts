import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../../authentication service/auth.service';
import { Observable, switchMap, of, map } from 'rxjs';
import { User } from '../../../models/userDetails.model';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  fetchUsers() {
    return this.firestore.collection('users', ref => ref.where('role', '!=', 'admin')).valueChanges({ idField: 'uid' });
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => ref.where('role', '==', role))
      .valueChanges({ idField: 'uid' });
  }

  updateUserStatus(userId: string, status: boolean) {
    return this.firestore.doc(`users/${userId}`).update({ status: status ? 'active' : 'inactive' });
  }

  getCurrentUserDetails(): Observable<User | null> {
    return this.authService.getCurrentUserObservable().pipe(
      switchMap(user => {
        if (!user) return of(null);
        return this.firestore.doc<User>(`users/${user.uid}`).valueChanges().pipe(
          map(userDetails => userDetails || null)
        );
      })
    );
  }

  deleteUser(userId: string): void {
    this.getCurrentUserDetails().subscribe(user => {
      if (user && user.role === 'admin') {
        this.firestore.doc(`users/${userId}`).delete().then(() => {
          console.log('User deleted successfully');
        }).catch(error => {
          console.error('Error deleting user:', error);
        });
      } else {
        console.error('Unauthorized attempt to delete user');
      }
    });
  }
}
