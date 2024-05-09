import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses service/courses.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../authentication service/auth.service';
import { CourseProgress } from '../../models/courseProgress.model';

@Component({
  selector: 'app-completion-status',
  templateUrl: './completion-status.component.html',
  styleUrl: './completion-status.component.css'
})
export class CompletionStatusComponent implements OnInit {
  courses: CourseProgress[] = [
    {
      id: 'course1',
      title: 'React JS',
      progress: 85,
      completed: true,
      grade: 'A'
    },
    {
      id: 'course2',
      title: 'Flutter',
      progress: 70,
      completed: false,
      grade: 'B'
    },
    {
      id: 'course3',
      title: 'COA',
      progress: 95,
      completed: true,
      grade: 'A+'
    },
    {
      id: 'course3',
      title: 'Marketing',
      progress: 95,
      completed: true,
      grade: 'A+'
    }
  ];
  constructor(
    private courseService: CoursesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.authService.getCurrentStudentObservable().subscribe({
    //   next: uid => {
    //     if (uid) {
    //       console.log("User ID is available:", uid);
    //       this.courses$ = this.courseService.getProgressWithCourseDetails(uid);
    //       this.courses$.subscribe(courses => {
    //         console.log("Courses loaded:", courses);
    //       });
    //     } else {
    //       console.error("No user ID found");
    //     }
    //   },
    //   error: error => console.error('Error fetching user ID:', error)
    // });
  }
}


