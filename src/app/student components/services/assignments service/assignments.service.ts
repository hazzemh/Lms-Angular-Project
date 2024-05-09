import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, finalize, last, map, switchMap } from 'rxjs/operators';
import { firstValueFrom, from, Observable, throwError } from 'rxjs';
import { Assignment } from '../../../models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  async getIdfromAssignment(courseId: string, assignmentId: string): Promise<string | undefined> {
    const assignmentPath = `courses/${courseId}/assignments/${assignmentId}`;
    const assignmentObservable = this.db.doc<Assignment>(assignmentPath).valueChanges().pipe(
      map(assignment => assignment ? assignment.instructorId : undefined)
    );
    return await firstValueFrom(assignmentObservable);
  }

  uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File, assignmentId: string,
    studentId: string, courseId: string, instructorId?: string) {
    const sanitizedFileName = encodeURIComponent(fileToUpload.name);
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${sanitizedFileName}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileToUpload);

    return uploadTask.snapshotChanges().pipe(
      last(),
      switchMap(() => from(fileRef.getDownloadURL())),
      switchMap(fileUrl => this.createSubmissionRecord(instructorId, assignmentId, studentId, courseId, fileUrl)),
      catchError(error => throwError(() => new Error(`Upload failed: ${error.message}`)))
    );
  }

  createSubmissionRecord(instructorId: string | undefined, assignmentId: string, studentId: string, courseId: string, fileUrl: string) {
    const submission = {
      instructorId: instructorId,
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

