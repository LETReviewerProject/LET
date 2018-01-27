import { MajoringService } from './../../../services/majoring.service';
import { Majoring } from './../../../models/majoring';
import { BtnActions } from './../../../helpers/btnactions';
import { Prompts } from './../../../helpers/prompts';
import { LoginService } from './../../../services/login.service';
import { UserRegistration } from './../../../models/register';
import {
  Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef,
  trigger, state, style, transition, animate, keyframes, OnDestroy
} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { growAnimateContainer } from './../../../shared/transitions';
import { UserLogin } from './../../../models/userLogin';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
  animations: [growAnimateContainer]
})

export class RegisterComponent implements OnInit, AfterViewInit {
  public userRegistration: UserRegistration = new UserRegistration();
  public userRegistrationForm: FormGroup;
  public usernameErrorMsg: string;
  public passwordErrorMsg: string;
  public emailErrorMsg: string;
  public subscription: Subscription;
  public errorMessage: string = '';
  public msgs: any[] = [];
  public btnRegisterText: string = BtnActions.register;
  public majorings: Majoring[];
  public address: string = '';

  private validationMessages = {
    required: 'is required.',
    minlength: 'must me at least over 3 characters'
  };

  constructor(private router: Router, private loginService: LoginService, private majoringService: MajoringService, private formBuilder: FormBuilder) {
    this.subscription = this.majoringService.listMajoring().subscribe(response => {
      if (response.success === true) {
        this.majorings = response.majorings;
      }
    })
  }

  ngAfterViewInit() {
    $("#majoring").prop("selectedIndex", -1);
  }

  ngOnInit() {
    this.userRegistrationForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(35)]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(35)]
      ],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.minLength(4),
        Validators.maxLength(35)]
      ],
      school: ['', [
        Validators.minLength(4),
        Validators.maxLength(155)]
      ],
      fullname: ['', [
        Validators.minLength(4),
        Validators.maxLength(35)]
      ],
      contact: ['', [
        Validators.maxLength(35)]
      ],
      address: ['', [
        Validators.maxLength(255)]
      ],
      majoring: ['', []
      ]
    })

    //watch username value changes
    const usernameControl = this.userRegistrationForm.get('username');
    usernameControl.valueChanges.debounceTime(1000).subscribe(value => this.setUsernameMessage(usernameControl))

    //watch password value changes
    const passwordControl = this.userRegistrationForm.get('password');
    passwordControl.valueChanges.debounceTime(1000).subscribe(value => this.setPasswordMessage(passwordControl))

    //watch email value changes
    const emailControl = this.userRegistrationForm.get('email');
    emailControl.valueChanges.debounceTime(1000).subscribe(value => this.setEmailMessage(emailControl))
  }

  onRegister() {
    this.btnRegisterText = BtnActions.registering;

    this.subscription = this.loginService.handleUserRegistration(this.userRegistrationForm.value).subscribe(response => {
      if (response.success === true) {
        // localStorage.setItem('currentUser', JSON.stringify(response)); //store response in localstorage

        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.registered });

        setTimeout(() => {
          this.btnRegisterText = BtnActions.register;
          this.router.navigate(['login']);
        }, 3000);

      } else if (response.success === false) {
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
      }

      this.btnRegisterText = BtnActions.register;
    },
      error => {
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.registerFailed });
      });
  }

  setUsernameMessage(c: AbstractControl) {
    this.usernameErrorMsg = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.usernameErrorMsg = 'Username ' + Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
    }
  }

  setPasswordMessage(c: AbstractControl) {
    this.passwordErrorMsg = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.passwordErrorMsg = 'Password ' + Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
    }
  }

  setEmailMessage(c: AbstractControl) {
    this.emailErrorMsg = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailErrorMsg = 'Invalid Email ' + Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
    }
  }



}