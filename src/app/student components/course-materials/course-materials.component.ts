import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses service/courses.service';

@Component({
  selector: 'app-course-materials',
  templateUrl: './course-materials.component.html',
  styleUrl: './course-materials.component.css'
})
export class CourseMaterialsComponent implements OnInit {
  courses: any[] = [];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.coursesService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }
}
