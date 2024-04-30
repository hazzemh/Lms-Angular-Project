import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../authentication service/auth.service';
import { switchMap, of, combineLatest, map, catchError, first, throwError, forkJoin, tap, from } from 'rxjs';
import { Course } from '../../../models/course.model';
import firebase from 'firebase/compat/app';
import { CourseProgress } from '../../../models/courseProgress.model';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private db: AngularFirestore, private authService: AuthService) { }

  addLecture(courseId: string, lecture: any): Promise<void> {
    const lectureId = this.db.createId();
    return this.db.doc(`courses/${courseId}/lectures/${lectureId}`).set({
      ...lecture,
    });
  }

  getLectures(courseId: string) {
    return this.db.collection(`courses/${courseId}/lectures`).valueChanges({ idField: 'id' });
  }

  getProgressWithCourseDetails(studentId: string): Observable<CourseProgress[]> {
    return this.db.collection('progress').doc(studentId)
      .collection<CourseProgress>('courses').snapshotChanges().pipe(
        tap(actions => console.log('Snapshot actions:', actions)),
        switchMap(actions => {
          if (actions.length === 0) {
            console.log('No course progress found.');
            return of([]);
          }
          return forkJoin(
            actions.map(action => {
              const progressData = action.payload.doc.data() as CourseProgress;
              const courseId = action.payload.doc.id;
              return this.db.collection<Course>('courses').doc<Course>(courseId).valueChanges().pipe(
                map(courseDetails => ({
                  ...progressData,
                  id: courseId,
                  title: courseDetails ? courseDetails.title : 'No title',
                  description: courseDetails?.description,
                  instructor: courseDetails?.instructor,
                  enrolledStudents: courseDetails?.enrolledStudents
                })),
                tap(details => console.log(`Details fetched for course ID: ${courseId}`, details))
              );
            })
          );
        }),
        catchError(error => {
          console.error("Error fetching combined course progress:", error);
          return throwError(() => new Error("Failed to fetch combined course progress data"));
        })
      );
  }

  updateCourse(id: string, course: Partial<Course>): Promise<void> {
    return this.db.collection('courses').doc(id).update(course);
  }

  archiveCourse(id: string): Promise<void> {
    return this.updateCourse(id, { isActive: false });
  }

  unarchiveCourse(courseId: string): Promise<void> {
    return this.db.collection('courses').doc(courseId).update({ isActive: true });
  }

  getArchivedCourses(): Observable<Course[]> {
    return this.db.collection<Course>('courses', ref => ref.where('isActive', '==', false)).valueChanges({ idField: 'id' });
  }

  addStudentToCourse(courseId: string, studentId: string): Promise<void> {
    return this.db.collection('courses').doc(courseId).update({
      enrolledStudents: firebase.firestore.FieldValue.arrayUnion(studentId)
    });
  }

  removeStudentFromCourse(courseId: string, studentId: string): Promise<void> {
    return this.db.collection('courses').doc(courseId).update({
      enrolledStudents: firebase.firestore.FieldValue.arrayRemove(studentId)
    });
  }

  getCourseById(courseId: string): Observable<any> {
    return this.db.collection('courses').doc(courseId).valueChanges();
  }

  isStudentEnrolled(courseId: string, studentId: string): Observable<boolean> {
    return this.getEnrolledStudents(courseId).pipe(
      map(studentIds => studentIds.includes(studentId))
    );
  }

  getEnrolledStudents(courseId: string): Observable<any[]> {
    return this.db.collection('courses').doc<Course>(courseId).valueChanges().pipe(
      switchMap(course => {
        if (!course || !course.enrolledStudents || course.enrolledStudents.length === 0) {
          return of([]);
        }
        const studentObservables = course.enrolledStudents.map(studentId =>
          this.db.collection('users').doc(studentId).valueChanges()
        );
        return forkJoin(studentObservables);
      })
    );
  }

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

  addAssignment(courseId: string, assignmentData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const assignmentsRef = this.db.collection('courses').doc(courseId).collection('assignments');
      assignmentsRef.add({
        ...assignmentData,
        createdOn: new Date()
      })
        .then(docRef => {
          console.log(`Assignment added with ID: ${docRef.id}`);
          resolve();
        })
        .catch(error => {
          console.error('Error adding assignment:', error);
          reject(error);
        });
    });
  }

  getMyCourses(instructorId: string): Observable<Course[]> {
    return this.db.collection<Course>('courses', ref =>
      ref.where('instructorId', '==', instructorId))
      .valueChanges({ idField: 'id' });
  }

  getAllCourses(): Observable<any[]> {
    return this.db.collection<Course>('courses', ref => ref.where('isActive', '==', true)).valueChanges({ idField: 'id' });
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


