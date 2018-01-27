import { BtnActions } from './../../../helpers/btnactions';
import { NgForm } from '@angular/forms';
import { Prompts } from './../../../helpers/prompts';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppSettings } from './../../../helpers/app.settings';
import { LoginService } from './../../../services/login.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
   templateUrl: 'confirmation.component.html',
   styleUrls: ['confirmation.component.css']
})

export class ConfirmationComponent implements OnInit, AfterViewInit {
   url: string = AppSettings.loginUrl;
   subscription: any;
   param: string = '';
   isActivated: boolean = false;
   msgs: any[] = [];
   btnActivateText: string = BtnActions.activate;

   constructor(private router: Router, private loginService: LoginService, private activatedRoute: ActivatedRoute) { }

   ngOnInit() {

   }

   ngAfterViewInit() {
      setTimeout(() => {
         this.activatedRoute.params.subscribe((params: Params) => {
            this.param = params['guid'];
         });
      }, 1000);
   }

   onActivate(frm: NgForm) {
      let ret: any;
      frm['guid'] = this.param;

      this.btnActivateText = BtnActions.activating;

      this.subscription = this.loginService.isRegistered(frm).subscribe(response => {
         if (response.success === true && response.isreg == false) {

            this.subscription = this.loginService.confirmRegistration(frm).subscribe(response => {
               if (response.success === true) {

                  setTimeout(() => {
                     this.btnActivateText = BtnActions.activate;

                     this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.activationSuccess });

                     this.isActivated = true;
                  }, 3000)

               }
            },
               error => {
                  this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.activationFailed });

                  setTimeout(() => {
                     this.router.navigate(['login']);
                  }, 3000)
               });

         } else {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.registerExist });

            setTimeout(() => {
               this.router.navigate(['login']);
            }, 3000)

            return;
         }
      },
         error => {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.activationFailed });

            setTimeout(() => {
               this.router.navigate(['/login']);
            }, 3000)
         });
   }
}