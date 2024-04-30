import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CoursesService } from '../services/courses service/courses.service';

@Component({
  selector: 'app-course-lectures',
  templateUrl: './course-lectures.component.html',
  styleUrl: './course-lectures.component.css'
})
export class CourseLecturesComponent implements OnInit {
  courseId!: string;
  lectures$!: Observable<any>;

  constructor(private route: ActivatedRoute, private courseService: CoursesService) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
      this.courseId = courseId;
      this.lectures$ = this.courseService.getLectures(this.courseId);
    } else {
      console.error('No course ID provided!');
      alert('No Course Id is provided.');
    }
  }
}
