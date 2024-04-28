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
import { InstructorDashboardComponent } from './instructor components/instructor-dashboard/instructor-dashboard.component';
import { CourseCreationComponent } from './instructor components/course-creation/course-creation.component';
import { InstructorCoursesComponent } from './instructor components/instructor-courses/instructor-courses.component';
import { AdminDashboardComponent } from './admin components/admin-dashboard/admin-dashboard.component';
import { AccountsManagementComponent } from './admin components/accounts-management/accounts-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'courses', component: CourseMaterialsComponent, canActivate: [AuthGuard], data: { expectedRole: 'student' } },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuard], data: { expectedRole: 'student' } },
  { path: 'track-progress', component: ProgressTrackingComponent , canActivate: [AuthGuard], data: { expectedRole: 'student' }},
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'student' } },
  { path: 'instructor-dashboard', component:InstructorDashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'instructor' } },
  { path: 'course-creation', component:CourseCreationComponent, canActivate: [AuthGuard], data: { expectedRole: 'instructor' } },
  { path: 'my-courses', component:InstructorCoursesComponent, canActivate: [AuthGuard], data: { expectedRole: 'instructor' } },
  { path: 'admin-dashboard', component:AdminDashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: 'accounts', component:AccountsManagementComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: '**', redirectTo: '/register' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
