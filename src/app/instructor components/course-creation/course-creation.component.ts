import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CoursesService } from '../../student components/services/courses service/courses.service';
import Swal from 'sweetalert2';
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
          Swal.fire('Success!', 'Course Added Successfully', 'success');
           form.reset();
           },
        error: (error) =>{
           console.error(error);
           Swal.fire('Error!', 'Failed to add course!', 'error');
          }
      });
    }
  }
} 
