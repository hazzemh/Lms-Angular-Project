import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { AuthService } from '../../authentication service/auth.service';
import { CoursesService } from '../../student components/services/courses service/courses.service';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.css'
})
export class InstructorCoursesComponent implements OnInit{
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

  ngOnInit(): void {}
}