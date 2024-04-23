import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from '../services/assignments service/assignments.service';
import { CoursesService } from '../services/courses service/courses.service';

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
  
  constructor(
    private coursesService: CoursesService,
    private assignmentsService: AssignmentsService,
  ) {}

  ngOnInit() {
    this.fetchCourses();
    this.fetchAssignments();
  }

  private fetchCourses() {
    const studentId = 'your-student-id'; 
    this.coursesService.getStudentCourses(studentId).subscribe(data => {
      this.courses = data;
    });
  }

  private fetchAssignments() {
    const studentId = 'your-student-id';
    this.assignmentsService.getStudentAssignments(studentId).subscribe(data => {
      this.assignments = data;
    });
  }
  
}
