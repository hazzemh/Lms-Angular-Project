import { Component } from '@angular/core';
import { AssignmentsService } from '../services/assignments service/assignments.service';

@Component({
  selector: 'app-assignment-submission',
  templateUrl: './assignment-submission.component.html',
  styleUrl: './assignment-submission.component.css'
})
export class AssignmentSubmissionComponent {
  assignments: any[] = [];
  selectedFile: File | null = null;
  selectedAssignmentId: string | null = null;
  
  constructor(private assignmentsService: AssignmentsService) {}

  loadAssignments(courseId: string): void {
    this.assignmentsService.getAssignmentsByCourse(courseId).subscribe(assignments => {
      this.assignments = assignments;
    }, error => {
      console.error('Failed to load assignments:', error);
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files ? element.files[0] : null;
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmitAssignment(assignmentId: string): void {
    if (this.selectedFile) {
      this.assignmentsService.uploadFileAndGetMetadata('assignment_submissions', this.selectedFile)
        .subscribe({
          next: (fileUrl: string) => {
            this.assignmentsService.submitAssignment(assignmentId, 'studentId', fileUrl)
              .then(() => alert('Assignment submitted successfully'))
              .catch(error => console.error('Failed to submit assignment', error));
          },
          error: (error) => console.error('Failed to upload file:', error)
        });
    } else {
      alert('No file selected');
    }
  }
}
