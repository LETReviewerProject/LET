import { Observable } from 'rxjs/Rx';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class RouteGuard implements CanActivate {
   constructor(private router: Router, private activatedRoute: ActivatedRoute) {
      // this.router.events.subscribe((r:any) => {
      //    console.log(r.url);
      //    return false;
      // });

   }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      // if (localStorage.getItem('currentUser') != null) {
      //    const is_admin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;
         
      //    if (is_admin === 0) {
      //       this.router.navigate(['/dashboard/profile']);
      //       return false;

      //    } else if (is_admin === 1) {
      //       this.router.navigate(['/dashboard/categories']);
      //       return false;

      //    } 

      //    //console.log('user has session');
      //    //return false;
      // }
      

      return true;
   }

}