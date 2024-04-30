import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Submission } from '../../../models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {

  constructor(private firestore: AngularFirestore) {}

  getSubmissions(): Observable<Submission[]> {
    return this.firestore.collection<Submission>('submissions').valueChanges({ idField: 'id' });
  }

  updateGrade(submissionId: string, grade: string, feedback: string): Promise<void> {
    return this.firestore.collection('submissions').doc(submissionId).update({ grade: grade, feedback: feedback });
  }
   
}
