import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { LoginComponent } from './login/login.component';
import { AssignmentSubmissionComponent } from './student components/assignment-submission/assignment-submission.component';
import { CourseCardComponent } from './student components/course-card/course-card.component';
import { CourseMaterialsComponent } from './student components/course-materials/course-materials.component';
import { StudentDashboardComponent } from './student components/student-dashboard/student-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AssignmentsComponent } from './student components/assignments/assignments.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CourseCreationComponent } from './instructor components/course-creation/course-creation.component';
import { InstructorDashboardComponent } from './instructor components/instructor-dashboard/instructor-dashboard.component';
import { InstructorCoursesComponent } from './instructor components/instructor-courses/instructor-courses.component';
import { AdminDashboardComponent } from './admin components/admin-dashboard/admin-dashboard.component';
import { AccountsManagementComponent } from './admin components/accounts-management/accounts-management.component';
import { AdminEnrollmentComponent } from './admin components/admin-enrollment/admin-enrollment.component';
import { CompletionStatusComponent } from './student components/completion-status/completion-status.component';
import { CourseManagementComponent } from './admin components/course-management/course-management.component';
import { ArchivedCoursesComponent } from './admin components/archived-courses/archived-courses.component';
import { InstructorGradeSubmissionsComponent } from './instructor components/instructor-grade-submissions/instructor-grade-submissions.component';
import { CourseLecturesComponent } from './student components/course-lectures/course-lectures.component';
import { GradesComponent } from './student components/grades/grades.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    CourseMaterialsComponent,
    AssignmentSubmissionComponent,
    StudentDashboardComponent,
    CourseCardComponent,
    NavbarComponent,
    AssignmentsComponent,
    CourseCreationComponent,
    InstructorDashboardComponent,
    InstructorCoursesComponent,
    AdminDashboardComponent,
    AccountsManagementComponent,
    AdminEnrollmentComponent,
    CompletionStatusComponent,
    CourseManagementComponent,
    ArchivedCoursesComponent,
    InstructorGradeSubmissionsComponent,
    CourseLecturesComponent,
    GradesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
