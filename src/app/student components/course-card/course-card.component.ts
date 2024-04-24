import { Component, Input } from '@angular/core';
import { AuthService } from '../../authentication service/auth.service';
import { CoursesService } from '../services/courses service/courses.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input() course: any; // Make sure the course input is properly typed

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService
  ) {}

  enrollCourse(courseId: string) {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.coursesService.enrollStudentInCourse(user.uid, courseId).then(() => {
          alert('Enrollment successful!');
        }).catch(error => {
          console.error('Enrollment failed:', error);
          alert('Failed to enroll in course.');
        });
      }
    });
  }
}
