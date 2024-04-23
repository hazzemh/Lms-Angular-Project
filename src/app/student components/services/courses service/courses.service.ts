import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private db: AngularFirestore) {}

  getAllCourses() {
    return this.db.collection('courses').valueChanges({ idField: 'id' });
  }

  getCourseById(courseId: string) {
    return this.db.collection('courses').doc(courseId).valueChanges();
  }

  getStudentCourses(studentId: string): Observable<any[]> {
    return this.db.collection('courses', ref => ref.where('studentId', '==', studentId)).valueChanges();
}
}
