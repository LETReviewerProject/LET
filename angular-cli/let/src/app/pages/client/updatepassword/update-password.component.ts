import { ActivatedRoute, Params } from '@angular/router';
import { BtnActions } from './../../../helpers/btnactions';
import { PasswordValidation } from './../../../helpers/passwordvalidation';
import { Prompts } from './../../../helpers/prompts';
import { LoginService } from './../../../services/login.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { growAnimateContainer } from './../../../shared/transitions';

@Component({
   templateUrl: 'update-password.component.html',
   styleUrls: ['update-password.component.css'],
   animations: [growAnimateContainer]
})

export class UpdatePasswordComponent implements OnInit {
   btnUpdateText: string = BtnActions.update;
   password: string = '';
   confirmpassword: string = '';
   form: FormGroup;
   msgs: any[] = [];
   subscription: any;
   isDisabled: boolean = false;
   passwordMatchErrorMsg: string = '';
   confirmPasswordMatchErrorMsg: string = '';

   private validationMessages = {
      required: 'is required.',
      minlength: 'must me at least over 3 characters'
   };

   constructor(fb: FormBuilder, private loginService: LoginService, private activatedRoute: ActivatedRoute) {
      this.form = fb.group({
         password: ['', Validators.required],
         confirmPassword: ['', Validators.required]
      },
      {
         validator: PasswordValidation.MatchPassword
      })
   }

   ngOnInit() { }

   onUpdate() {
      this.btnUpdateText = BtnActions.updating;

      this.activatedRoute.queryParams.subscribe((params: Params) => {

         const update_token = this.activatedRoute.snapshot.params['guid'];
         const password = this.form.value.password;
         const confirmPassword = this.form.value.confirmPassword;

         if (password === '' && confirmPassword === '') {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.passwordUpdateError });
         }

         this.form.value['update_token'] = update_token;

         this.subscription = this.loginService.updatePassword(this.form.value).subscribe(response => {
            if (response.success === true) {
               setTimeout(() => {
                  this.loginService.handleLogout();
               }, 3000);

               setTimeout(() => {
                  this.btnUpdateText = BtnActions.update;
                  this.form.reset();

                  this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.passwordUpdateSuccess });
               }, 1000);
            }
         },
            error => {
               this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.passwordUpdateError });
            });

      });

   }
}