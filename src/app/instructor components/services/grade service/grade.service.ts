import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Grade } from '../../../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  constructor(private firestore: AngularFirestore) {}

  addOrUpdateGrade(courseId: string, studentId: string, grade: Grade): Promise<void> {
    return this.firestore.doc(`courses/${courseId}/grades/${studentId}`).set(grade, { merge: true });
  }

  getGradesForCourse(courseId: string): Observable<Grade[]> {
    return this.firestore.collection<Grade>(`courses/${courseId}/grades`).valueChanges();
  }

  getGradeForStudent(courseId: string, studentId: string): Observable<Grade> {
    return this.firestore.doc<Grade>(`courses/${courseId}/grades/${studentId}`).valueChanges().pipe(
      map(grade => grade ?? this.getDefaultGrade())
    );
  }

  private getDefaultGrade(): Grade {
    return {
      studentId: '',
      yearWork: 0,
      midterm: 0,
      quizzes: 0,
      practical: 0
    };
  }
}
