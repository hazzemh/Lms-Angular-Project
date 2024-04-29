import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../student components/services/courses service/courses.service';

@Component({
  selector: 'app-archived-courses',
  templateUrl: './archived-courses.component.html',
  styleUrl: './archived-courses.component.css'
})
export class ArchivedCoursesComponent implements OnInit {
  archivedCourses$!: Observable<Course[]>;

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadArchivedCourses();
  }

  loadArchivedCourses(): void {
    this.archivedCourses$ = this.coursesService.getArchivedCourses();
  }

  unarchiveCourse(courseId: string): void {
    this.coursesService.unarchiveCourse(courseId).then(() => {
      console.log('Course unarchived successfully');
      alert('Course unarchived successfully');
      this.loadArchivedCourses();
    });
  }
}
