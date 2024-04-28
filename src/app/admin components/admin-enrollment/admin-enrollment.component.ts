import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subscription, switchMap, map, of } from 'rxjs';
import { CoursesService } from '../../student components/services/courses service/courses.service';
import { UserManagementService } from '../services/user management service/user-management.service';

@Component({
  selector: 'app-admin-enrollment',
  templateUrl: './admin-enrollment.component.html',
  styleUrls: ['./admin-enrollment.component.css']  // Corrected 'styleUrls' instead of 'styleUrl'
})
export class AdminEnrollmentComponent implements OnDestroy {
  courses$!: Observable<any[]>;
  students$!: Observable<any[]>;
  enrollmentStatus$!: Observable<{ [courseId: string]: { [studentId: string]: boolean } }>;
  private subscriptions: Subscription = new Subscription();

  constructor(private courseService: CoursesService, private userService: UserManagementService) { }

  ngOnInit() {
    this.courses$ = this.courseService.getAllCourses();
    this.students$ = this.userService.getUsersByRole('student');
    this.populateEnrollmentStatus();
  }
  populateEnrollmentStatus() {
    const status: { [courseId: string]: { [studentId: string]: boolean } } = {};
    const sub = combineLatest([this.courses$, this.students$]).subscribe(([courses, students]) => {
      courses.forEach(course => {
        status[course.id] = {};
        students.forEach(student => {
          status[course.id][student.uid] = course.enrolledStudents && course.enrolledStudents.includes(student.uid);
        });
      });
      this.enrollmentStatus$ = of(status);
      console.log('Final enrollment status:', status);
    });
    this.subscriptions.add(sub);
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  checkEnrollment(courseId: string, studentId: string): Observable<boolean> {
    return this.enrollmentStatus$.pipe(
      map(status => status[courseId] && status[courseId][studentId])
    );
  }

  assignStudent(courseId: string, studentId: string) {
    this.courseService.addStudentToCourse(courseId, studentId).then(() => {
      console.log('Student added successfully');
      alert('Student added successfully');
    }).catch(error => {
      console.error('Failed to add student', error);
      alert('Failed to add student');
    });
  }

  unassignStudent(courseId: string, studentId: string) {
    this.courseService.removeStudentFromCourse(courseId, studentId).then(() => {
      console.log('Student removed successfully');
      alert('Student removed successfully')
    }).catch(error => {
      console.error('Failed to remove student', error);
      alert('Failed to remove student');
    });
  }
}
