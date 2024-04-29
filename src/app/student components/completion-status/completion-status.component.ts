import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses service/courses.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../authentication service/auth.service';
import { CourseProgress } from '../../models/courseProgress.model';

@Component({
  selector: 'app-completion-status',
  templateUrl: './completion-status.component.html',
  styleUrl: './completion-status.component.css'
})
export class CompletionStatusComponent implements OnInit {
  courses: CourseProgress[] = [];
  userId: string | null = null;

  constructor(private courseService: CoursesService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentStudentObservable().subscribe({
      next: uid => {
        this.userId = uid;
        if (this.userId) {
          this.courseService.getProgressWithCourseDetails(this.userId).subscribe({
            next: (courses) => {
              this.courses = courses;
              console.log("Courses updated:", this.courses);  // Verify data is received
            },
            error: (error) => console.error('Error fetching courses:', error)
          });
        }
      },
      error: error => console.error('Error fetching user ID:', error)
    });
  
  }

}



// getProgress(courseId: string | undefined): number {
//   if (!courseId) {
//     console.log("No course ID provided for progress.");
//     return 0; // Return default progress if no ID
//   }
//   const courseProgress = this.progressMap[courseId];
//   console.log(`Getting progress for ${courseId}:`, courseProgress?.progress);
//   return courseProgress?.progress ?? 0;
// }

// isCompleted(courseId: string | undefined): boolean {
//   if (!courseId) {
//     console.log("No course ID provided for completion status.");
//     return false; // Return default completion status if no ID
//   }
//   const courseProgress = this.progressMap[courseId];
//   console.log(`Completion status for ${courseId}:`, courseProgress?.completed);
//   return courseProgress?.completed ?? false;
// }

// getGrade(courseId: string | undefined): string {
//   if (!courseId) {
//     console.log("No course ID provided for grade.");
//     return "N/A"; // Return default grade if no ID
//   }
//   const courseProgress = this.progressMap[courseId];
//   console.log(`Grade for ${courseId}:`, courseProgress?.grade);
//   return courseProgress?.grade ?? "N/A";
// }


