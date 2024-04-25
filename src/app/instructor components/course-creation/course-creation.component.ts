import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CoursesService } from '../../student components/services/courses service/courses.service';

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrl: './course-creation.component.css'
})
export class CourseCreationComponent {
  constructor(private coursesService: CoursesService) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.coursesService.addCourse(form.value).subscribe({
        next: () => {
           alert('Course added successfully');
           form.reset();
           },
        error: (error) =>{
           console.error(error);
           alert('Failed to add course. Please try again.');
          }
      });
    }
  }
} 
