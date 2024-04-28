import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  constructor(private firestore: AngularFirestore) { }

  fetchUsers() {
    return this.firestore.collection('users', ref => ref.where('role', '!=', 'admin')).valueChanges({ idField: 'uid' });
  }

  updateUserStatus(userId: string, status: boolean) {
    return this.firestore.doc(`users/${userId}`).update({ status: status ? 'active' : 'inactive' });
  }

  deleteUser(userId: string) {
    return this.firestore.doc(`users/${userId}`).delete();
  }
}
