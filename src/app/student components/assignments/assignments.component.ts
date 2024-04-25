import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, combineLatest, map, of, catchError } from 'rxjs';
import { AuthService } from '../../authentication service/auth.service';
import { CoursesService } from '../services/courses service/courses.service';
import { CourseWithAssignments } from '../../models/courseWithAssignments.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css'
})
export class AssignmentsComponent implements OnInit {
  coursesWithAssignments$!: Observable<CourseWithAssignments[]>;
  isSubmissionDialogOpen: boolean = false;
  selectedAssignmentId: string | null = null;
  selectedCourseId: string | null = null;

  constructor(private authService: AuthService, private courseService: CoursesService,) {}

  convertTimestamps(coursesWithAssignments: CourseWithAssignments[]) {
    return coursesWithAssignments.map(course => ({
      ...course,
      assignments: course.assignments.map(assignment => ({
        ...assignment,
        dueDate: assignment.dueDate.toDate()
      }))
    }));
  }

  ngOnInit(): void {
    this.coursesWithAssignments$ = this.authService.getCurrentUserObservable().pipe(
      switchMap(user => user ? this.courseService.getAssignedCourses(user.uid) : of([])),
      switchMap(courses =>
        combineLatest(
          courses.filter(course => course.id).map(course =>
            this.courseService.getAssignmentsForCourse(course.id!).pipe(
              map(assignments => assignments.length > 0 ? {
                id: course.id as string,
                name: course.title,
                assignments: assignments
              } : null)
            )
          )
        )
      ),
      map(results => results.filter((course): course is CourseWithAssignments => course !== null)),
      map(this.convertTimestamps)
    );
  }
  

  openSubmissionDialog(courseId: string, assignmentId: string): void {
    this.selectedCourseId = courseId;
    this.selectedAssignmentId = assignmentId;
    this.isSubmissionDialogOpen = true;
  }

  closeSubmissionDialog(): void {
    this.isSubmissionDialogOpen = false;
    this.selectedAssignmentId = null;
    this.selectedCourseId = null;
  }
}