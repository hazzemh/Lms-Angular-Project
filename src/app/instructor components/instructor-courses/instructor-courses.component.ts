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
  isAddLectureDialogOpen = false;
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

  openAddLectureDialog(courseId: string) {
    this.selectedCourseId = courseId;
    this.isAddLectureDialogOpen = true;
  }

  closeAddLectureDialog() {
    this.isAddLectureDialogOpen = false;
  }

  openAddAssignmentDialog(courseId: string): void {
    this.selectedCourseId = courseId;
    this.isAddAssignmentDialogOpen = true;
  }

  closeAddAssignmentDialog(): void {
    this.isAddAssignmentDialogOpen = false;
    this.selectedCourseId = null;
  }

  submitLecture(lectureData: any) {
    if (this.selectedCourseId) {
      this.coursesService.addLecture(this.selectedCourseId, lectureData).then(() => {
        alert('Lecture Added Successfully.');
        this.closeAddLectureDialog();
      }).catch(error => {
        console.error('Failed to add lecture:', error);
        alert('Failed to add lecture.');
      });
    }
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


  addMultimedia(courseId: string) {
  }

}
