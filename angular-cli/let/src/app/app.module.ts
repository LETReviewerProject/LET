import { ResultDetailComponent } from './pages/dashboard/resultdetail/results-detail.component';
import { TimerService } from './services/timer.service';
import { TimerComponent } from './pages/dashboard/timer/timer.component';
import { ExamGuard } from './services/exam-guart.service';
import { ResultGuard } from './services/result-guard.service';
import { ResultsComponent } from './pages/client/results/results.component';
import { ExamStartComponent } from './pages/client/examstart/exam-start.component';
import { ExamService } from './services/exam.service';
import { HeaderClientComponent } from './pages/client/header/header-client.component';
import { ExamOverviewComponent } from './pages/client/exam/exam-overview.component';
import { MajoringService } from './services/majoring.service';
import { MajoringComponent } from './pages/dashboard/majoring/majoring.component';
import { ProfileService } from './services/profile.service';
import { UpdatePasswordComponent } from './pages/client/updatepassword/update-password.component';
import { ConfirmationComponent } from './pages/client/confirmation/confirmation.component';
import { RouteGuard } from './services/route-guard.service';
import { AuthGuard } from './services/auth-guard.service';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { ForgotPasswordComponent } from './pages/client/forgotpassword/forgot-password.component';
import { RegisterComponent } from './pages/client/register/register.component';
import { LoginService } from './services/login.service';
import { LoginComponent } from './pages/client/login/login.component';
import { UserService } from './services/user.service';
import { UserComponent } from './pages/dashboard/user/user.component';
import { StudentService } from './services/student.service';
import { StudentComponent } from './pages/dashboard/students/student.component';
import { TeacherService } from './services/teacher.service';
import { TeacherComponent } from './pages/dashboard/teacher/teacher.component';
import { QuestionService } from './services/question.service';
import { QuestionComponent } from './pages/dashboard/question/question.component';
import { CategoryService } from './services/categories.service';
import { DataTableComponent } from './shared/datatable/datatable.component';
import { SideNavComponent } from './pages/dashboard/sidenav/sidenav.component';
import { CategoryComponent } from './pages/dashboard/category/category.component';
import { routing } from './app.routing';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './pages/dashboard/header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DataTableModule, SharedModule, DialogModule, GrowlModule, ConfirmDialogModule, ConfirmationService,
  FileUploadModule, RadioButtonModule, CheckboxModule, TooltipModule, BlockUIModule, ProgressBarModule
} from 'primeng/primeng';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { RoundPipe } from './shared/roundPipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CategoryComponent,
    SideNavComponent,
    DataTableComponent,
    QuestionComponent,
    TeacherComponent,
    StudentComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    ConfirmationComponent,
    UpdatePasswordComponent,
    FileSelectDirective,
    MajoringComponent,
    ExamOverviewComponent,
    HeaderClientComponent,
    ExamStartComponent,
    ResultsComponent,
    TimerComponent,
    ResultDetailComponent,
    RoundPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DataTableModule,
    RouterModule,
    DialogModule,
    HttpModule,
    FormsModule,
    GrowlModule,
    ConfirmDialogModule,
    FileUploadModule,
    ReactiveFormsModule,
    RadioButtonModule,
    CheckboxModule,
    TooltipModule,
    BlockUIModule,
    ProgressBarModule,
    routing
  ],
  providers: [TimerService, ExamGuard, ResultGuard, ExamService, MajoringService, ProfileService, RouteGuard, AuthGuard, LoginService, CategoryService, QuestionService, TeacherService, StudentService, UserService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
