import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  getStudentAssignments(studentId: string): Observable<any[]> {
    return this.db.collection('assignments', ref => ref.where('studentId', '==', studentId)).valueChanges();
  }
  
  getAssignmentsByCourse(courseId: string) {
    return this.db.collection('assignments', ref => ref.where('courseId', '==', courseId)).valueChanges({ idField: 'id' });
  }

  uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File) {
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${fileToUpload.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileToUpload);

    return uploadTask.snapshotChanges().pipe(
      switchMap(() => from(fileRef.getDownloadURL())),
      catchError(error => throwError(() => new Error(error)))
    );
  }

  submitAssignment(assignmentId: string, studentId: string, fileUrl: string): Promise<void> {
    const submission = {
      assignmentId,
      studentId,
      submittedFileUrl: fileUrl,
      timestamp: new Date()
    };
    return this.db.collection('submissions').add(submission).then(() => {});
  }
  
}
