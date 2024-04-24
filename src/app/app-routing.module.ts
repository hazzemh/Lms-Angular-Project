import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AssignmentSubmissionComponent } from './student components/assignment-submission/assignment-submission.component';
import { CourseMaterialsComponent } from './student components/course-materials/course-materials.component';
import { ProgressTrackingComponent } from './student components/progress-tracking/progress-tracking.component';
import { StudentDashboardComponent } from './student components/student-dashboard/student-dashboard.component';
import { AuthGuard } from '../auth.guard';
import { AssignmentsComponent } from './student components/assignments/assignments.component';

const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'courses', component: CourseMaterialsComponent, canActivate: [AuthGuard], data: { expectedRole: 'student' } },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuard], data: { expectedRole: 'student' } },
  { path: 'track-progress', component: ProgressTrackingComponent , canActivate: [AuthGuard], data: { expectedRole: 'student' }},
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'student' } },
  { path: '**', redirectTo: '/register' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
