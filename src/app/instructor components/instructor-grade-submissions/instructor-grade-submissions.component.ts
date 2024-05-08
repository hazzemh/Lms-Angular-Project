import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Submission } from '../../models/submission.model';
import { SubmissionsService } from '../services/submission service/submissions.service';
import { EnrichedSubmission } from '../../models/enrichedSubmission.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../authentication service/auth.service';
@Component({
  selector: 'app-instructor-grade-submissions',
  templateUrl: './instructor-grade-submissions.component.html',
  styleUrl: './instructor-grade-submissions.component.css'
})
export class InstructorGradeSubmissionsComponent implements OnInit {
  enrichedSubmissions$!: Observable<EnrichedSubmission[]>;
  userId!: string;

  constructor(private authService: AuthService, private submissionsService: SubmissionsService) { }

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe(user => {
      this.userId = user ? user.uid : '';
      this.enrichedSubmissions$ = this.submissionsService.getSubmissions(this.userId).pipe(
        switchMap(submissions => combineLatest(
          submissions.map(submission =>
            combineLatest([
              this.submissionsService.getStudentName(submission.studentId),
              this.submissionsService.getAssignmentTitle(submission.courseId, submission.assignmentId)
            ]).pipe(
              map(([user, assignment]) => ({
                submission: submission,
                user: user,
                assignment: assignment
              }))
            )
          )
        ))
      );
    });
  }

  saveGrade(submission: Submission, grade: string | undefined, feedback: string | undefined): void {
    if (!submission.id) {
      console.error('Submission ID is undefined');
      return;
    }
    const safeGrade = grade ?? 'No Grade';
    const safeFeedback = feedback ?? 'No Feedback';

    this.submissionsService.updateGrade(submission.id, safeGrade, safeFeedback)
      .then(() => Swal.fire('Success!', 'Grade Added Successfully', 'success'))
      .catch(err => Swal.fire('Error!', 'Failed to add Grade!', 'error'));
  }
}
