import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../student components/services/courses service/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css'] // Correct the property name from styleUrl to styleUrls
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse?: Course;
  isEditModalOpen = false;

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      courses => {
        this.courses = courses;
      },
      error => {
        Swal.fire('Error!', 'Failed to load courses.', 'error');
      }
    );
  }

  openEditModal(course: Course): void {
    this.selectedCourse = course;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  updateCourse(course: Course): void {
    if (!course.id) {
      Swal.fire('Error!', 'Cannot update course without an ID', 'error');
      return;
    }

    this.courseService.updateCourse(course.id, {
      title: course.title,
      description: course.description, 
      instructorId: course.instructorId
    }).then(() => {
      Swal.fire('Success!', 'Course updated successfully', 'success');
      this.closeEditModal();
    }).catch(error => {
      Swal.fire('Error!', 'Failed to update course', 'error');
    });
  }

  archiveCourse(courseId: string | undefined): void {
    if (!courseId) {
      Swal.fire('Error!', 'Attempted to archive a course without an ID', 'error');
      return;
    }
    
    this.courseService.archiveCourse(courseId).then(() => {
      Swal.fire('Success!', 'Course archived successfully', 'success');
    }).catch(error => {
      Swal.fire('Error!', 'Failed to archive course', 'error');
    });
  }
}
