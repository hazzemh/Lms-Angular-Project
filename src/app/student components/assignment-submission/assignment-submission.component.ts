import { Component, Input } from '@angular/core';
import { AssignmentsService } from '../services/assignments service/assignments.service';
import { AuthService } from '../../authentication service/auth.service';

@Component({
  selector: 'app-assignment-submission',
  templateUrl: './assignment-submission.component.html',
  styleUrl: './assignment-submission.component.css'
})
export class AssignmentSubmissionComponent {
  selectedFile: File | null = null;
  @Input()
  assignmentId!: string; 
  @Input()
  courseId!: string;
  errorMessage: string | null = null;
  studentId: string | null = null;

  constructor(private assignmentsService: AssignmentsService, private authService: AuthService) {
    this.authService.getCurrentUserObservable().subscribe(user => {
      if (user) {
        this.studentId = user.uid; 
      } else {
        this.studentId = null;
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files ? element.files[0] : null;
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmitAssignment(): void {
    if (!this.assignmentId || !this.studentId || !this.courseId) {
      alert('Missing assignment details');
      return;
    }

    if (this.selectedFile) {
      this.assignmentsService.uploadFileAndGetMetadata(
        'assignment_submissions', 
        this.selectedFile, 
        this.assignmentId, 
        this.studentId, 
        this.courseId
      ).subscribe({
        next: (docRef) => {
          console.log('Assignment submitted successfully', docRef.id);
          alert('Assignment submitted successfully');
        },
        error: (error) => {
          console.error('Failed to submit assignment:', error);
          alert('Assignment submitted successfully');
        }
      });
    } else {
      alert('No file selected');
    }
  }
}
