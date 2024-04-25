import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../authentication service/auth.service';
import { switchMap, of, combineLatest, map, catchError, first, throwError } from 'rxjs';
import { Course } from '../../../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private db: AngularFirestore, private authService: AuthService) { }

  addCourse(courseData: any): Observable<any> {
    return this.authService.getCurrentUserObservable().pipe(
      first(),
      switchMap(user => {
        if (user) {
          const course = {
            ...courseData,
            instructorId: user.uid
          };
          return this.db.collection('courses').add(course);
        } else {
          return throwError(() => new Error('No authenticated user available'));
        }
      }),
      catchError(error => throwError(() => new Error(`Error adding course: ${error.message}`)))
    );
  }
  
  getMyCourses(instructorId: string): Observable<Course[]> {
    return this.db.collection<Course>('courses', ref => 
      ref.where('instructorId', '==', instructorId))
      .valueChanges({ idField: 'id' });
  }

  getAllCourses(): Observable<any[]> {
    return this.db.collection('courses').valueChanges({ idField: 'id' });
  }

  getCourseDetails(courseId: string) {
    return this.db.collection('courses').doc(courseId).valueChanges();
  }

  getStudentCourses(studentId: string): Observable<any[]> {
    return this.db.collection('courses', ref => ref.where('studentId', '==', studentId)).valueChanges();
  }

  getAssignmentsForCourse(courseId: string): Observable<any[]> {
    return this.db.collection(`courses/${courseId}/assignments`).valueChanges({ idField: 'id' });
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


