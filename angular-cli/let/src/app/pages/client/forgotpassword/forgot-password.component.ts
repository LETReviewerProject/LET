import { BtnActions } from './../../../helpers/btnactions';
import { Prompts } from './../../../helpers/prompts';
import { LoginService } from './../../../services/login.service';
import {
   Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef,
   trigger, state, style, transition, animate, keyframes, OnDestroy, ViewChild
} from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms'
import { growAnimateContainer } from './../../../shared/transitions';
import { Router } from '@angular/router';

@Component({
   templateUrl: 'forgot-password.component.html',
   styleUrls: ['forgot-password.component.css'],
   animations: [growAnimateContainer]
})

export class ForgotPasswordComponent implements OnInit {
   btnResetText: string = BtnActions.resetPassword;
   isLogin: boolean;
   subsription: any;
   msgs: any[] = [];
   email: any;
   
   constructor(private loginService: LoginService, private router: Router) {
      if (localStorage.getItem('currentUser') != null) {
         this.isLogin = true;
      } else {
         this.isLogin = false;
      }
   }

   ngOnInit() {
   }

   onBack() {
      if (localStorage.getItem('currentUser')) {
         var is_admin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;

         if (is_admin === 0) {
            this.router.navigate(['/exam/overview']);

         } else if (is_admin === 1) {
            this.router.navigate(['/dashboard/categories']);

         }
      }
   }

   //sendPasswordReset
   onSend(frm: any) {
      this.btnResetText = BtnActions.sending;
      this.loginService.sendPasswordReset(frm).subscribe(response => {
         if (response.success === true) {
            this.email = '';

            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.passwordEmailSent });

            setTimeout(() => {
               this.btnResetText = BtnActions.resetPassword;
            }, 1000);
            
         }
      })
   }
}