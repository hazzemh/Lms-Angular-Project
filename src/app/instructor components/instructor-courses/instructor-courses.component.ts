import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { AuthService } from '../../authentication service/auth.service';
import { CoursesService } from '../../student components/services/courses service/courses.service';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.css'
})
export class InstructorCoursesComponent {
  isAddAssignmentDialogOpen = false;
  selectedCourseId: string | null = null;
  myCourses$!: Observable<Course[]>;
  userId!: string;

  constructor(private authService: AuthService, private coursesService: CoursesService) {
    this.authService.getCurrentUserObservable().subscribe(user => {
      this.userId = user ? user.uid : '';
      if (this.userId) {
        this.myCourses$ = this.coursesService.getMyCourses(this.userId);
      }
    });
  }

  openAddAssignmentDialog(courseId: string): void {
    this.selectedCourseId = courseId;
    this.isAddAssignmentDialogOpen = true;
  }

  closeAddAssignmentDialog(): void {
    this.isAddAssignmentDialogOpen = false;
    this.selectedCourseId = null;
  }

  submitAssignment(formValue: any): void {
    if (this.selectedCourseId) {
      this.coursesService.addAssignment(this.selectedCourseId, formValue).then(() => {
        console.log('Assignment added successfully');
        this.closeAddAssignmentDialog();
      }).catch(error => {
        console.error('Error adding assignment:', error);
      });
    }
  }

  addLectures(courseId: string) {

  }

  addMultimedia(courseId: string) {
  }

}
