import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../authentication service/auth.service';
import { switchMap, of, forkJoin, tap, combineLatest, map } from 'rxjs';
import { Course } from '../../../models/course.model';

interface Enrollment {
  courseId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private db: AngularFirestore, private authService: AuthService) { }

  getAllCourses() {
    return this.db.collection('courses').valueChanges({ idField: 'id' });
  }

  getCourseDetails(courseId: string) {
    return this.db.collection('courses').doc(courseId).valueChanges();
  }

  getStudentCourses(studentId: string): Observable<any[]> {
    return this.db.collection('courses', ref => ref.where('studentId', '==', studentId)).valueChanges();
  }

  enrollStudentInCourse(studentId: string, courseId: string): Promise<void> {
    return this.db.collection('users').doc(studentId)
      .collection('enrolledCourses').doc(courseId).set({
        enrolledDate: new Date()
      });
  }

  getEnrolledCourses(userId: string) {
    return this.db.collection(`users/${userId}/enrolledCourses`).snapshotChanges().pipe(
      switchMap(enrollments => {
        if (enrollments.length > 0) {
          const courseObservables = enrollments.map(enrollment => 
            this.getCourseDetails(enrollment.payload.doc.id));
          return combineLatest(courseObservables);
        } else {
          return of([]); // return empty array if no enrollments
        }
      })
    );
  }

  getAssignedCourses(userId: string): Observable<Course[]> {
    return this.db.collection<Course>('courses', ref => ref.where('enrolledStudents', 'array-contains', userId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Course;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
}


