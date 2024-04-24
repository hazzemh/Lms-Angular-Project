import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from '../services/assignments service/assignments.service';
import { CoursesService } from '../services/courses service/courses.service';
import { AuthService } from '../../authentication service/auth.service';
import { from, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  student: any; 
  courses: any[] = []; 
  assignments: any[] = [];
  announcements: any[] = [];
  userId!: string;
  enrolledCourses$!: Observable<any[]>;
  
  constructor(
    private coursesService: CoursesService,
    // private assignmentsService: AssignmentsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.enrolledCourses$ = from(this.authService.getCurrentUser()).pipe(
      switchMap(user => {
        if (user) {
          return this.coursesService.getEnrolledCourses(user.uid);
        } else {
          return of([]);
        }
      })
    );
  }

  // loadCourses() {
  //   this.coursesService.getEnrolledCourses(this.userId).subscribe(courses => {
  //     this.courses = courses;
  //     console.log("Courses loaded:", this.courses);
  //   }, error => {
  //     console.error('Failed to fetch courses:', error);
  //   });
  // }

  // private fetchAssignments() {
  //   const studentId = 'your-student-id';
  //   this.assignmentsService.getStudentAssignments(studentId).subscribe(data => {
  //     this.assignments = data;
  //   });
  // }
  
}
