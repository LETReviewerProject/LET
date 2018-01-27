import { LoginService } from './login.service';
import { Observable } from 'rxjs/Rx';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private loginService: LoginService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
		if (localStorage.getItem('currentUser') == null) {
			this.router.navigate(['/login']);
			return false;
		}

		//wrap try catch if any local variable breaks then force logout
		try {
			var username = JSON.parse(localStorage.getItem('currentUser')).user[0].username;
			var access_token_expiry = JSON.parse(localStorage.getItem('currentUser')).expires;
			var token = JSON.parse(localStorage.getItem('currentUser')).token;

			var issued_date = moment(new Date(access_token_expiry)).format('YY-MM-DD hh:mm:ss');
			var due_expiry = moment(new Date()).format('YY-MM-DD hh:mm:ss');

		} catch (e) {
			this.loginService.handleLogout();

			console.log('Authguard error..', e);
			return false;
		}


		if (issued_date < due_expiry) {
			localStorage.removeItem('currentUser');
			this.router.navigate(['/login']);

			console.log('Token is expired!');
			return false;
		}

		return this.loginService.handleAuthentication({ username, token })
			.map(response => {
				return response.json().isAuthenticated;
			})
			.catch(() => {
				localStorage.removeItem('currentUser');
				this.router.navigate(['/login']);
				return Observable.of(false);
			})

	}


}