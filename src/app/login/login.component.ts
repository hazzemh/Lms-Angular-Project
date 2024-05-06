import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../authentication service/auth.service';
import { FirebaseService } from '../firebase service/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
  
    const { email, password } = this.loginForm.value;
  
    try {
      const userCredential = await this.authService.login(email, password);
      const userData = await this.firebaseService.getUserData(userCredential.user.uid);
  
      if (userData && userData.status === 'active') {
        switch (userData.role) {
          case 'admin':
            this.router.navigate(['/admin-dashboard']);
            break;
          case 'instructor':
            this.router.navigate(['/instructor-dashboard']);
            break;
          case 'student':
            this.router.navigate(['/student-dashboard']);
            break;
          default:
            Swal.fire('Error!', 'Your role is not recognized in the system.', 'error');
            break;
        }
      } else {
        this.authService.logout();
        Swal.fire('Error!', 'Your account is either inactive or your role/status is incomplete.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Invalid Credentials!', 'error');
    }
  }

}
