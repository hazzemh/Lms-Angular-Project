import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../authentication service/auth.service';
import { FirebaseService } from '../firebase service/firebase.service';

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

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).then(userCredential => {
      this.firebaseService.getUserRole(userCredential.user.uid).then(role => {
        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'instructor') {
          this.router.navigate(['/instructor-dashboard']);
        } else {
          this.router.navigate(['/student-dashboard']);
        }
      }).catch(error => {
            console.error('Login error:', error);
            alert('Login failed!');
          });
    });
    
    // this.authService.login(email, password)
    //   .then(() => {
    //     alert('Login successful!');
    //     this.router.navigate(['/']);
    //   })
    //   .catch(error => {
    //     console.error('Login error:', error);
    //     alert('Login failed!');
    //   });
  }
}
