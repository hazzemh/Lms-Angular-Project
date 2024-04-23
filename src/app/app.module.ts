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
import { ProgressTrackingComponent } from './student components/progress-tracking/progress-tracking.component';
import { StudentDashboardComponent } from './student components/student-dashboard/student-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    CourseMaterialsComponent,
    AssignmentSubmissionComponent,
    ProgressTrackingComponent,
    StudentDashboardComponent,
    CourseCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
