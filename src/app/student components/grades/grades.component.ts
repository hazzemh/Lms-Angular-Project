import { Component } from '@angular/core';
import { Grade } from '../../models/grade.model';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent {
  grades: Grade[] = [
    {
      courseTitle: 'Flutter',
      practical: 18,
      yearWork: 8,
      midterm: 12,
      quizzes: 4,
      finalExam: 45
    },
    {
      courseTitle: 'React JS',
      practical: 20,
      yearWork: 9,
      midterm: 14,
      quizzes: 5,
      finalExam: 50
    },
    {
      courseTitle: 'Software Engineering',
      practical: 17,
      yearWork: 7,
      midterm: 10,
      quizzes: 3,
      finalExam: 40
    },
    {
      courseTitle: 'Problem Solving',
      practical: 17,
      yearWork: 7,
      midterm: 10,
      quizzes: 3,
      finalExam: 40
    },
    {
      courseTitle: 'UI/UX',
      practical: 20,
      yearWork: 10,
      midterm: 15,
      quizzes: 5,
      finalExam: 50
    },
  ];
}
