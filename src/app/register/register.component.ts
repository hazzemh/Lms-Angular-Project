// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../authentication service/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      role: ['student', Validators.required]
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      const { email, password, name, role } = this.registerForm.value;
      await this.authService.register(email, password,name, role);
      Swal.fire('Success!', 'Regisetration successful, waiting for admin to activate it.', 'success');
      this.router.navigate(['/login']);
    } catch (error) {
      Swal.fire('Error!', 'Registeration Failed', 'error');
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleError(error: any): void {
    Swal.fire('Error!', 'Registeration Failed', 'error');
  }
}
