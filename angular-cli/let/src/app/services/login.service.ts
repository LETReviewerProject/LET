import { Http } from '@angular/http';
import { BaseApiService } from './base.service';
import { AppSettings } from '../helpers/app.settings';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService extends BaseApiService {

   constructor(http: Http, private router: Router) {
      super(http); //inject from super to base class
   }

   //remove localstorage item
   handleLogout() {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
   }

   //check api if authenticated
   handleAuthentication(body: any) {
      return this.post('isAuthenticated', JSON.stringify(body));
   }

   //form user login
   handleUserLogin(body: any) {
      return this.post('login', JSON.stringify(body))
         .map(response => response.json())
         .catch(this.handleServerError)
   }

   handleUserRegistration(body: any) {
      return this.post('register', JSON.stringify(body))
         .map(response => response.json())
         .catch(this.handleServerError)
   }

   confirmRegistration(body: any) {
      return this.post('confirmRegistration', JSON.stringify(body)).map(response => response.json())
         .catch(this.handleServerError)

   }

   isRegistered(body: any) {
      return this.post('isRegistered', JSON.stringify(body)).map(response => response.json())
         .catch(this.handleServerError)

   }

   sendPasswordReset(body: any) {
      return this.post('resetPassword', JSON.stringify(body)).map(response => response.json())
         .catch(this.handleServerError)

   }

   updatePassword(body: any) {
      return this.post('updatePassword', JSON.stringify(body)).map(response => response.json())
         .catch(this.handleServerError)

   }

}