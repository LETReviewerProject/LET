import { ResultDetailComponent } from './pages/dashboard/resultdetail/results-detail.component';
import { ExamGuard } from './services/exam-guart.service';
import { ResultGuard } from './services/result-guard.service';
import { ResultsComponent } from './pages/client/results/results.component';
import { ExamStartComponent } from './pages/client/examstart/exam-start.component';
import { ExamOverviewComponent } from './pages/client/exam/exam-overview.component';
import { MajoringComponent } from './pages/dashboard/majoring/majoring.component';
import { UpdatePasswordComponent } from './pages/client/updatepassword/update-password.component';
import { ConfirmationComponent } from './pages/client/confirmation/confirmation.component';
import { RouteGuard } from './services/route-guard.service';
import { AuthGuard } from './services/auth-guard.service';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { ForgotPasswordComponent } from './pages/client/forgotpassword/forgot-password.component';
import { RegisterComponent } from './pages/client/register/register.component';
import { LoginComponent } from './pages/client/login/login.component';
import { UserComponent } from './pages/dashboard/user/user.component';
import { StudentComponent } from './pages/dashboard/students/student.component';
import { TeacherComponent } from './pages/dashboard/teacher/teacher.component';
import { QuestionComponent } from './pages/dashboard/question/question.component';
import { CategoryComponent } from './pages/dashboard/category/category.component';
import { Routes, RouterModule } from '@angular/router';
import { TimerComponent } from './pages/dashboard/timer/timer.component';

const appRoutes: Routes = [
   { path: '', component: LoginComponent },
   {
      path: 'dashboard',
      children: [
         { path: '', redirectTo: 'categories', pathMatch: 'full' },
         { path: 'categories', component: CategoryComponent, canActivate: [AuthGuard] },
         { path: 'majoring', component: MajoringComponent, canActivate: [AuthGuard] },
         { path: 'questions', component: QuestionComponent, canActivate: [AuthGuard] },
         { path: 'teachers', component: TeacherComponent, canActivate: [AuthGuard] },
         { path: 'students', component: StudentComponent, canActivate: [AuthGuard] },
         { path: 'usermngmnt', component: UserComponent, canActivate: [AuthGuard] },
         { path: 'set-timer', component: TimerComponent, canActivate: [AuthGuard] },
         { path: 'results/detail/:guid', component: ResultDetailComponent, canActivate: [AuthGuard] },
      ]
   },
   {
      path: 'exam',
      children: [
         { path: '', redirectTo: 'overview', pathMatch: 'full' },
         { path: 'overview', component: ExamOverviewComponent },
         { path: 'overview', component: ExamOverviewComponent },
         { path: 'start/:selection', component: ExamStartComponent, canActivate: [ExamGuard] },
         { path: 'results/:selection/:guid/:cid', component: ResultsComponent, canActivate: [ResultGuard] },
      ]
   },
   { path: 'login', component: LoginComponent },
   { path: 'register', component: RegisterComponent },
   { path: 'forgot-password', component: ForgotPasswordComponent },
   { path: 'confirmation/:guid', component: ConfirmationComponent },
   { path: 'update-password/:guid', component: UpdatePasswordComponent },
   { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
   { path: '**', redirectTo: '' }
]

export const routing = RouterModule.forRoot(appRoutes);