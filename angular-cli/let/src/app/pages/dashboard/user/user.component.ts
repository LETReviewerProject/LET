
import { growSlowlyAnimation } from './../../../shared/transitions';
import { User } from './../../../models/user';
import { ConfirmationService } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { UserService } from './../../../services/user.service';
import { formState } from './../../../helpers/ae';
import { MajoringService } from './../../../services/majoring.service';
import { Majoring } from './../../../models/majoring';
import { BtnActions } from './../../../helpers/btnactions';
import { Prompts } from './../../../helpers/prompts';
import { LoginService } from './../../../services/login.service';
import { UserRegistration } from './../../../models/register';
import {
  Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef,
  trigger, state, style, transition, animate, keyframes, OnDestroy, ViewChild
} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { growAnimateContainer } from './../../../shared/transitions';
import { UserLogin } from './../../../models/userLogin';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css'],
  animations: [growSlowlyAnimation]
})

export class UserComponent implements OnInit {
  public users: any[] = [];
  public selectedRows: any[] = [];
  public cols: any[];
  public sub: Subscription;
  public errorMessage: string;
  public display: boolean = false;
  public dialogTitle: string = '';
  public guid: string = '';
  public username: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public status: string = '';
  public state: number;
  public btnAction: string = '';
  public msgs: any[] = [];
  public isEditDisabled: boolean = true;
  public isDeleteDisabled: boolean = true;
  public userRegistration: UserRegistration = new UserRegistration();
  public userRegistrationForm: FormGroup;
  public usernameErrorMsg: string;
  public passwordErrorMsg: string;
  public confirmPasswordErrorMsg: string;
  public emailErrorMsg: string;
  public subscription: Subscription;
  public btnRegisterText: string = BtnActions.register;
  public majorings: Majoring[];
  public address: string = '';
  public isteacher: boolean = false;
  public loading: boolean;

  @ViewChild('tblUser') staleSelections: any;

  constructor(private userService: UserService, private studentService: UserService, private confirmationService: ConfirmationService,
    private router: Router, private loginService: LoginService, private majoringService: MajoringService, private formBuilder: FormBuilder) {
    this.subscription = this.majoringService.listMajoring().subscribe(response => {
      if (response.success === true) {
        this.majorings = response.majorings;
      }
    })
  }

  private validationMessages = {
    required: 'is required.',
    minlength: 'must me at least over 3 characters',
    invalidConfirmPassword: 'Password doesnt match..'
  };

  ngOnInit() {
    this.loading = true;

    this.cols = [
      { field: 'guid', header: 'ID', style: { 'width': '15px', 'textalign': 'left' } },
      { field: 'username', header: 'Username', style: { 'width': '35px', 'textalign': 'left' } },
      { field: 'email', header: 'Email', style: { 'width': '55px', 'textalign': 'left' } },
      { field: 'status', header: 'Confirmed', style: { 'width': '25px', 'textalign': 'center' } },
      { field: 'isteacher', header: 'Teacher', style: { 'width': '25px', 'textalign': 'center' } }
    ]

    this.handleUserlist();

    this.userRegistrationForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(35)]
      ],
      passwordFormGroup: this.formBuilder.group({
        password: ['', [Validators.required]],
        confirmpassword: ['', [Validators.required]],
      }, { validator: this.myCustomPasswordMatcher }),
      // password: ['', [
      //   Validators.required,
      //   Validators.minLength(4),
      //   Validators.maxLength(35)]
      // ],
      // confirmpassword: ['', [
      //   Validators.required,
      //   Validators.minLength(4),
      //   Validators.maxLength(35)]
      // ],
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
      ],
      isteacher: ['', []
      ],

    })

    //watch username value changes
    const usernameControl = this.userRegistrationForm.get('username');
    usernameControl.valueChanges.debounceTime(1000).subscribe(value => this.setUsernameMessage(usernameControl))

    //watch password value changes
    // const passwordControl = this.userRegistrationForm.get('password');
    // passwordControl.valueChanges.debounceTime(1000).subscribe(value => this.setPasswordMessage(passwordControl))
    this.userRegistrationForm.get('passwordFormGroup').valueChanges.subscribe(value => {
      this.watchConfirmPasswordError(this.userRegistrationForm.get('passwordFormGroup'))
    })

    //watch email value changes
    const emailControl = this.userRegistrationForm.get('email');
    emailControl.valueChanges.debounceTime(1000).subscribe(value => this.setEmailMessage(emailControl))
  }

  ngAfterViewInit() {

  }

  myCustomPasswordMatcher(c: AbstractControl) {
    let password = c.get('password');
    let confirmPassword = c.get('confirmpassword');

    if (password.pristine || confirmPassword.pristine) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { invalidConfirmPassword: true }
    }

    return null;
  }

  watchConfirmPasswordError(control: AbstractControl) {
    this.confirmPasswordErrorMsg = '';

    if ((control.touched || control.dirty) && control.errors) {
      this.confirmPasswordErrorMsg = Object.keys(control.errors).map(key => this.validationMessages[key]).join(', ');
    }
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

  onAddUser() {
    this.clearForm();

    this.dialogTitle = 'New User';
    this.display = true;
    this.state = formState.add;
    this.btnAction = BtnActions.save;
  }

  activateRegistration(users, event) {
    var classList = event.target.classList;
    var el = event.target;

    if(users !== undefined) {
      if(classList.contains('btn-success')) {

        //perform api request here..
        this.sub = this.userService.activateUser(users)
          .subscribe(response => {
     
            this.msgs.push({ severity: 'success', summary: Prompts.activationSuccess });
          })

        classList.remove('btn-success');
        classList.add('btn-default');

        el.innerText = 'Activated';
      }
    }
  }

  onRegister(frm: NgForm) {
    this.btnRegisterText = BtnActions.registering;

    this.subscription = this.loginService.handleUserRegistration(this.userRegistrationForm.value).subscribe(response => {
      if (response.success === true) {
        this.display = false;
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.registered });

        this.handleUserlist();

      } else if (response.success === false) {
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: response.message });
      }

      this.btnRegisterText = BtnActions.register;
    },
      error => {
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.registerFailed });
      });
  }

  onRefresh() {
    this.handleUserlist();
  }

  unSelectRows() {
    this.staleSelections.selectedRows = [];
  }

  clearForm() {
    this.guid = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.isteacher = false;
  }

  //get categories
  handleUserlist() {
    this.sub = this.studentService.listUser()
      .subscribe(response => {
        this.users = response.users;
        this.loading = false;
      })
  }

  //all selections
  handleAllSelection(selections: any) {
    this.selectedRows = selections;
  }

  handleRowSelect(evt: any) {
    //if checked
    if (evt.originalEvent.checked == true) {
      this.selectedRows.push(evt.data);
    } else { //if unchecked

      var index = this.selectedRows.indexOf(evt.data);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      }
    }

    //enable / disable edt buttn
    if (this.selectedRows.length == 1) {
      this.isEditDisabled = false;
    } else {
      this.isEditDisabled = true;
    }

    //enable / disable delete button
    if (this.selectedRows.length > 0) {
      this.isDeleteDisabled = false;
    } else {
      this.isDeleteDisabled = true;
    }
  }

  onDelete() {
    if (this.selectedRows.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
          this.selectedRows.forEach(eachObj => {
            this.sub = this.studentService.deleteUser(eachObj.guid)
              .subscribe(response => {
                this.users = response.users;

                this.msgs.push({ severity: 'info', summary: Prompts.deleted });

                this.selectedRows = [];
                this.unSelectRows();

              }, error => this.errorMessage = error)

          })
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}