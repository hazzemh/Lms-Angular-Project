import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../models/submission.model';
import { SubmissionsService } from '../services/submission service/submissions.service';

@Component({
  selector: 'app-instructor-grade-submissions',
  templateUrl: './instructor-grade-submissions.component.html',
  styleUrl: './instructor-grade-submissions.component.css'
})
export class InstructorGradeSubmissionsComponent implements OnInit {
  submissions$!: Observable<Submission[]>;

  constructor(private submissionsService: SubmissionsService) {}

  ngOnInit(): void {
    this.submissions$ = this.submissionsService.getSubmissions();
  }

  saveGrade(submission: Submission, grade: string | undefined, feedback: string | undefined): void {
    if (!submission.id) {
      console.error('Submission ID is undefined');
      return;
    }
    const safeGrade = grade ?? 'No Grade';
    const safeFeedback = feedback ?? 'No Feedback';

    this.submissionsService.updateGrade(submission.id, safeGrade, safeFeedback)
      .then(() => alert('Grade successfully updated'))
      .catch(err => alert('Error updating grade: ' + err));
  }
}
