import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses service/courses.service';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { AuthService } from '../../authentication service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-materials',
  templateUrl: './course-materials.component.html',
  styleUrl: './course-materials.component.css'
})
export class CourseMaterialsComponent implements OnInit {
  courses$!: Observable<Course[]>;
  userId: string | null = null;

  constructor(private router: Router,private coursesService: CoursesService, private authService: AuthService,) { }

  ngOnInit(): void {
    this.authService.getCurrentStudentObservable().subscribe(uid => {
      this.userId = uid;
      if (this.userId) {
        this.courses$ = this.coursesService.getAssignedCourses(this.userId);
        console.log('course materials : ', this.courses$);
      }
    });
  }

  goToLectures(courseId: string): void {
    this.router.navigate(['/courses', courseId, 'lectures']);
  }
}
