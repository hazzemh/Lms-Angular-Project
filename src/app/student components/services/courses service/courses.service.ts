import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../authentication service/auth.service';
import { switchMap, of, combineLatest, map, catchError, first, throwError, forkJoin, tap, from, mergeMap, toArray, startWith } from 'rxjs';
import { Course } from '../../../models/course.model';
import firebase from 'firebase/compat/app';
import { CourseProgress } from '../../../models/courseProgress.model';
import { Progress } from '../../../models/progress.model';
import { User } from '../../../models/userDetails.model';


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

  getStudentProgress(userId: string): Observable<Progress[]> {
    return this.db.collection(`users/${userId}/progress`).snapshotChanges().pipe(
      mergeMap(actions => from(actions)),
      mergeMap(action => {
        const data = action.payload.doc.data() as Progress;
        const courseId = action.payload.doc.id;
        return this.db.collection('courses').doc<Course>(courseId).valueChanges().pipe(
          map(course => {
            return {
              ...data,
              courseId: courseId,
              courseTitle: course ? course.title : 'No title' 
            };
          })
        );
      }),
      toArray()
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
    const courseRef = this.db.collection('courses').doc(courseId);
    const studentProgressRef = this.db.collection(`users/${studentId}/progress`).doc(courseId);

    return this.db.firestore.runTransaction(async transaction => {
      const courseDoc = await transaction.get(courseRef.ref);

      if (!courseDoc.exists) {
        throw new Error("Course does not exist!");
      }

      transaction.update(courseRef.ref, {
        enrolledStudents: firebase.firestore.FieldValue.arrayUnion(studentId)
      });

      transaction.set(studentProgressRef.ref, {
        completed: false,
        grade: "",
        progress: 10
      }, { merge: true });

    }).catch(error => {
      console.error("Transaction failed: ", error);
      throw error;
    });
  }

  removeStudentFromCourse(courseId: string, studentId: string): Promise<void> {
    const courseRef = this.db.collection('courses').doc(courseId);
    const progressRef = this.db.collection(`users/${studentId}/progress`).doc(courseId);

    return this.db.firestore.runTransaction(async transaction => {
      const courseDoc = await transaction.get(courseRef.ref);

      if (!courseDoc.exists) {
        throw new Error("Course does not exist!");
      }

      transaction.update(courseRef.ref, {
        enrolledStudents: firebase.firestore.FieldValue.arrayRemove(studentId)
      });

      transaction.delete(progressRef.ref);

    }).then(() => {
      console.log("Student removed from course and progress deleted successfully.");
    }).catch(error => {
      console.error("Transaction failed: ", error);
      throw error;
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
      tap(course => console.log('Course data:', course)), // Log course data
      switchMap(course => {
        if (!course || !course.enrolledStudents || course.enrolledStudents.length === 0) {
          console.log('No enrolled students or course data missing');
          return of([]);
        }
        const studentObservables = course.enrolledStudents.map(studentId =>
          this.db.collection('users').doc<User>(studentId).valueChanges().pipe(
            tap(user => console.log(`Fetching data for student ${studentId}:`, user)) // Log each user's data
          )
        );
        return forkJoin(studentObservables);
      })
    );
  }
  
  getEnrolledStudentsInCourse(courseId: string): Observable<User[]> {
    return this.db.collection('courses').doc<Course>(courseId).valueChanges().pipe(
      tap(course => console.log('Course data:', course)),
      switchMap(course => {
        if (!course || !course.enrolledStudents || course.enrolledStudents.length === 0) {
          console.log('No enrolled students or course data missing');
          return of([]);
        }
        const studentObservables = course.enrolledStudents.map(studentId =>
          this.db.collection('users').doc<User>(studentId).valueChanges().pipe(
            catchError(err => {
              console.error(`Error fetching user ${studentId}:`, err);
              return of(null);
            })
          )
        );
        
        return forkJoin(studentObservables).pipe(
          map(users => users.filter((user): user is User => user !== null && user !== undefined)),
          tap(filteredUsers => console.log('Filtered users:', filteredUsers))
        );
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
            isActive : true,
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
      ref.where('instructorId', '==', instructorId)
         .where('isActive', '==', true))
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
    return this.db.collection<Course>('courses', ref =>
      ref.where('enrolledStudents', 'array-contains', userId)
        .where('isActive', '==', true))
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


