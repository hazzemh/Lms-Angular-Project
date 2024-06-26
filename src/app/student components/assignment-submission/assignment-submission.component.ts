import { Component, Input } from '@angular/core';
import { AssignmentsService } from '../services/assignments service/assignments.service';
import { AuthService } from '../../authentication service/auth.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assignment-submission',
  templateUrl: './assignment-submission.component.html',
  styleUrls: ['./assignment-submission.component.css']
})
export class AssignmentSubmissionComponent {
  selectedFile: File | null = null;
  fileLabelText: string = "Choose a file";
  @Input() assignmentId!: string;
  @Input() courseId!: string;
  errorMessage: string | null = null;
  studentId: string | null = null;
  instructorId!: string | undefined;

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
      this.fileLabelText = "File Selected: " + file.name;
    } else {
      this.fileLabelText = "Choose a file";
    }
  }

  async onSubmitAssignment(): Promise<void> {
    if (!this.assignmentId || !this.studentId || !this.courseId) {
      alert('Missing assignment details');
      return;
    }
    const instructorId = await this.assignmentsService.getIdfromAssignment(this.courseId, this.assignmentId);
    if (!instructorId) {
      throw new Error('Instructor ID is undefined. Cannot proceed with file upload.');
    }
    this.instructorId = instructorId;
    if (this.selectedFile) {
      this.assignmentsService.uploadFileAndGetMetadata(
        'assignment_submissions',
        this.selectedFile,
        this.assignmentId,
        this.studentId,
        this.courseId,
        this.instructorId
      ).subscribe({
        next: (docRef) => {
          Swal.fire('Success!', 'Assignment submitted successfully', 'success');
          this.fileLabelText = "Choose a file";
        },
        error: (error) => {
          Swal.fire('Error!', 'Failed to submit Assignment', 'error');
        }
      });
    } else {
      Swal.fire('Error!', 'No File selected!', 'error');
    }
  }
}
