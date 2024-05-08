import { Component, Input, OnInit } from '@angular/core';
import { Grade } from '../../models/grade.model';
import { GradeService } from '../services/grade service/grade.service';
import { Observable } from 'rxjs';
import { CoursesService } from '../../student components/services/courses service/courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grade-students',
  templateUrl: './grade-students.component.html',
  styleUrl: './grade-students.component.css'
})
export class GradeStudentsComponent implements OnInit {
  @Input() courseId!: string;
  students$!: Observable<any[]>;
  grades: { [key: string]: Grade } = {};

  constructor(private courseService: CoursesService, private gradeService: GradeService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;
    console.log('Course ID:', this.courseId);
    if (this.courseId) {
      this.students$ = this.courseService.getEnrolledStudentsInCourse(this.courseId);
      this.students$.subscribe(students => {
        console.log('Subscribed students:', students);
      });
    } else {
      console.log('No Course ID provided');
    }
  }

  updateGrade(studentId: string, grade: Grade) {
    this.gradeService.addOrUpdateGrade(this.courseId, studentId, grade).then(() => {
      console.log("Grade updated successfully!");
    });
  }
}
