import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../student components/services/courses service/courses.service';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse?: Course;
  isEditModalOpen = false;

  constructor(private courseService: CoursesService) {
    this.loadCourses();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  openEditModal(course: Course): void {
    this.selectedCourse = course;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  // addCourse(): void {
  //   const newCourse: Course = { title: 'New Course', description: 'Description', instructor: 'Instructor', isActive: true };
  //   this.courseService.addCourse(newCourse).then(() => console.log('Course added'));
  // }

  updateCourse(course: Course): void {
    if (!course.id) {
      console.error('Cannot update course without an ID');
      return;
    }
  
    this.courseService.updateCourse(course.id, {
      title: course.title,
      description: course.description, 
      instructorId: course.instructorId
    }).then(() => {
      console.log('Course updated successfully:', course.title);
      alert('Course updated successfully');
      this.closeEditModal();
    }).catch(error => {
      alert('Failed to update Course!');
      console.error('Failed to update course', error);
    });
  }

  archiveCourse(courseId: string | undefined): void {
    if (courseId) {
      this.courseService.archiveCourse(courseId).then(() => {
        console.log('Course archived successfully');
        alert('Course archived successfully');
      }).catch(error => {
        alert('Failed to archive course');
        console.error('Failed to archive course', error);
      });
    } else {
      console.error('Attempted to archive a course without an ID');
    }
  }
}
