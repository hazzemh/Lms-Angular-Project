import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Progress } from '../../../models/progress.model';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Course } from '../../../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  constructor(private db: AngularFirestore) { }

  getProgressForStudent(studentId: string) {
    return this.db.collection('users').doc(studentId).valueChanges();
  }

  getStudentProgressWithCourseTitles(userId: string): Observable<any[]> {
    return this.db.collection<Progress>(`users/${userId}/progress`).snapshotChanges().pipe(
      switchMap(progresses => {
        if (progresses.length === 0) {
          return of([]);
        }
        return forkJoin(
          progresses.map(progress => {
            const data = progress.payload.doc.data();
            const courseId = progress.payload.doc.id;

            return this.db.doc<Course>(`courses/${courseId}`).valueChanges().pipe(
              map(course => ({
                ...data,
                courseTitle: course ? course.title : 'Unknown Course'
              }))
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching data:', error); // Log any error
        return of([]); // Return empty array on error
      })
    );
  }
}
