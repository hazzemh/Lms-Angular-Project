import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  constructor(private db: AngularFirestore) {}

  getProgressForStudent(studentId: string) {
    return this.db.collection('users').doc(studentId).valueChanges();
  }
}
