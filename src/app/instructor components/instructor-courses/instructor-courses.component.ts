import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { AuthService } from '../../authentication service/auth.service';
import { CoursesService } from '../../student components/services/courses service/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.css']
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
        Swal.fire({
          title: 'Success!',
          text: 'Lecture Added Successfully.',
          icon: 'success'
        });
        this.closeAddLectureDialog();
      }).catch(error => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add lecture.',
          icon: 'error'
        });
      });
    }
  }

  submitAssignment(formValue: any): void {
    if (this.selectedCourseId) {
      this.coursesService.addAssignment(this.userId, this.selectedCourseId, formValue).then(() => {
        Swal.fire(
          'Success!',
          'Assignment added successfully',
          'success'
        );
        this.closeAddAssignmentDialog();
      }).catch(error => {
        Swal.fire(
          'Error!',
          'Error adding assignment',
          'error'
        );
      });
    }
  }

  addMultimedia(courseId: string) {
    // Add multimedia handling here
  }
}
