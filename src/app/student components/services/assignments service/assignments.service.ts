import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, finalize, last, switchMap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File, assignmentId: string, studentId: string, courseId: string) {
    const sanitizedFileName = encodeURIComponent(fileToUpload.name);
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${sanitizedFileName}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileToUpload);

    return uploadTask.snapshotChanges().pipe(
      last(), 
      switchMap(() => from(fileRef.getDownloadURL())),
      switchMap(fileUrl => this.createSubmissionRecord(assignmentId, studentId, courseId, fileUrl)),
      catchError(error => throwError(() => new Error(`Upload failed: ${error.message}`)))
    );
  }

  createSubmissionRecord(assignmentId: string, studentId: string, courseId: string, fileUrl: string) {
    const submission = {
      studentId: studentId,
      assignmentId: assignmentId,
      courseId: courseId,
      fileUrl: fileUrl,
      status: 'submitted',
      grade: null
    };
    return from(this.db.collection('submissions').add(submission));
  }

}
