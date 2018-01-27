import { Observable } from 'rxjs/Rx';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ResultGuard implements CanActivate {
   constructor(private router: Router, private activatedRoute: ActivatedRoute) {
   }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    
      //
      // if (localStorage.getItem('examSession') != null) {
      //    console.log('sorry bro cannot go back');

      //    var selection = JSON.parse(localStorage.getItem('resultsUrl')).selection;
      //    var result_guid = JSON.parse(localStorage.getItem('resultsUrl')).guid;

      //    //exam/results/elementary/RS-68761
      //    //`/exam/results/${selection}/${result_guid}`
      //    console.log(`/exam/results/elementary/RS-68761`);
      //    this.router.navigate([`/exam/results/elementary/RS-68761`]);
      //    return false;

      // } 

      console.log('ResultGuard');
      return true;
   }

}