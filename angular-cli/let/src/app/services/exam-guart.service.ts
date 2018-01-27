import { Observable } from 'rxjs/Rx';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ExamGuard implements CanActivate {
   constructor(private router: Router, private activatedRoute: ActivatedRoute) {
   }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

      if (localStorage.getItem('examSession') != null) {
         // var selection = JSON.parse(localStorage.getItem('resultsUrl')).selection;
         // var result_guid = JSON.parse(localStorage.getItem('resultsUrl')).guid;

         // this.router.navigate([`/exam/results/${selection}/${result_guid}`]);

         console.log('ExamGuard');
         //this.router.navigate([`/exam/overview`]);
      }

      
      return true;
   }

}