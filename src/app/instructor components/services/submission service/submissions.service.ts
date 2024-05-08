import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Submission } from '../../../models/submission.model';
import { Assignment } from '../../../models/assignment.model';
import { User } from '../../../models/userDetails.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {

  constructor(private firestore: AngularFirestore) {}

  getSubmissions(instructorId: string): Observable<Submission[]> {
    return this.firestore.collection<Submission>('submissions', ref => 
      ref.where('instructorId', '==', instructorId)
    ).valueChanges({ idField: 'id' });
  }

  
  getStudentName(studentId: string): Observable<User> {
    return this.firestore.collection<User>('users').doc(studentId).valueChanges().pipe(
      map(user => user ?? {
        name: 'Unknown',
        uid: 'N/A',
        email: 'noemail@example.com',
        status: 'inactive',
        role: 'N/A'
      })
    );
  }
  
  getAssignmentTitle(courseId: string, assignmentId: string): Observable<Assignment> {
    return this.firestore.doc<Assignment>(`courses/${courseId}/assignments/${assignmentId}`).valueChanges().pipe(
      map(assignment => assignment ?? {
        id: '',
        title: 'No Title',
        description: 'No Description Available',
        dueDate: 'N/A',
        totalMarks: 0
      })
    );
  }

  updateGrade(submissionId: string, grade: string, feedback: string): Promise<void> {
    return this.firestore.collection('submissions').doc(submissionId).update({ grade: grade, feedback: feedback });
  }
   
}
