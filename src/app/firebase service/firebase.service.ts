import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, map, take, throwError } from 'rxjs';
import { UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) { }

  setUserData(userId: string, data: any) {
    return this.firestore.collection('users').doc(userId).set(data);
  }

  async getUserRole(uid: string): Promise<string | null> {
    try {
      const docSnapshot = await this.firestore.collection('users').doc(uid).get().toPromise();

      if (docSnapshot?.exists) {
        const data = docSnapshot?.data() as { role: string };
        return data?.role ?? 'default_role'; // Return default role if missing
      } else {
        console.error('User document not found:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  async getUserData(userId: string): Promise<UserData | null> {
    try {
      const docSnapshot = await this.firestore.collection('users').doc(userId).get().toPromise();

      if (docSnapshot?.exists) {
        const data = docSnapshot.data() as UserData;
        if (!data.role || !data.status) {
          throw new Error('User data is incomplete or missing required fields');
        }
        return data;
      } else {
        throw new Error(`No user found with ID ${userId}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }


}

