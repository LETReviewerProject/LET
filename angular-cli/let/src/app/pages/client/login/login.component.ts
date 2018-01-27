import { LoginService } from './../../../services/login.service';
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

declare var $: any;

@Component({
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.css'],
	animations: [growAnimateContainer]
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
	appTitle = 'LET Reviewer System';
	position: string = 'before';
	errorMessage: string = '';
	userLoginForm: FormGroup; // userlogin form group
	userLogin: UserLogin = new UserLogin(); //userlogin model
	usernameErrorMsg: string;
	passwordErrorMsg: string;
	subscription: any;
	isteacher: any;

	constructor(private router: Router, private loginService: LoginService, private formBuilder: FormBuilder) {
		if (localStorage.getItem('currentUser')) {
         var is_admin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;

         if (is_admin === 0 && this.isteacher == 0) {
            this.router.navigate(['/exam/overview']);

         } else if (is_admin === 1 || this.isteacher == 1) {
            this.router.navigate(['/dashboard/categories']);

         }
      }
	}

	private validationMessages = {
		required: 'is required.',
		minlength: 'must me at least over 3 characters'
	};

	ngOnInit() {
		this.userLoginForm = this.formBuilder.group({
			username: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(35)]
			],
			password: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(35)]
			]
		})

		//watch username value changes
		const emailControl = this.userLoginForm.get('username');
		emailControl.valueChanges.debounceTime(1000).subscribe(value => this.setUsernameMessage(emailControl))

		//watch password value changes
		const passwordControl = this.userLoginForm.get('password');
		passwordControl.valueChanges.debounceTime(1000).subscribe(value => this.setPasswordMessage(passwordControl))
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

	//login action
	onLogin() {
		this.subscription = this.loginService.handleUserLogin(this.userLoginForm.value).subscribe(response => {
			if (response.success === true) {
				localStorage.setItem('currentUser', JSON.stringify(response)); //store response in localstorage

				var is_admin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;
				this.isteacher = JSON.parse(localStorage.getItem('currentUser')).user[0].isteacher;
	
				if(is_admin == 1 || this.isteacher == 1) {
					this.router.navigate(['/dashboard/categories']);
				} else {
					this.router.navigate(['/exam/overview']);
				}
				
			}
		},
			error => {
				this.errorMessage = 'Login Failed!';
			});

	}

	ngAfterViewInit() {

	}

	ngOnDestroy() {
	}

}