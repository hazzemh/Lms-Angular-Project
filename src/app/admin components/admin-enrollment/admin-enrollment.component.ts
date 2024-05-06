import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subscription, map, of } from 'rxjs';
import { CoursesService } from '../../student components/services/courses service/courses.service';
import { UserManagementService } from '../services/user management service/user-management.service';
import Swal from 'sweetalert2';

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
      Swal.fire('Success!', 'Student added successfully', 'success');

    }).catch(error => {
      Swal.fire('Error!', 'Failed to add student.', 'error');
    });
  }

  unassignStudent(courseId: string, studentId: string) {
    this.courseService.removeStudentFromCourse(courseId, studentId).then(() => {
      Swal.fire('Success!', 'Student removed successfully', 'success');
    }).catch(error => {
      Swal.fire('Error!', 'Failed to remove student.', 'error');
    });
  }
}
