import { Subscription } from 'rxjs';
import { AppSettings } from './../../../helpers/app.settings';
import { Profile } from './../../../models/profile';
import { ProfileService } from './../../../services/profile.service';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

@Component({
   moduleId: module.id,
   selector: 'app-client-header',
   templateUrl: 'header-client.component.html',
   styleUrls: ['header-client.component.css']
})

export class HeaderClientComponent implements OnInit, AfterViewInit {
   @Input() myTitle: string = 'LET Online Reviewer';
   public profile: Profile = new Profile();
   public sub: Subscription;
   public apiProfileImageUrl = AppSettings.apiProfileImageUrl;
   public isTeacher: number = 0;
   public isAdmin: number = 0;
   public isteacher: number = 0;
   public guid: any;

   constructor(private router: Router, private profileService: ProfileService) {
   }

   ngOnInit() {

      if (localStorage.getItem('currentUser')) {
         this.isAdmin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;
         this.isTeacher = JSON.parse(localStorage.getItem('currentUser')).user[0].isteacher;
         this.guid = JSON.parse(localStorage.getItem('currentUser')).user[0].id;

         if (this.isAdmin === 0) {
            //this.router.navigate(['/dashboard/profile']);
         }
      }
   }

   ngAfterViewInit() {
      if (this.guid) {
         this.sub = this.profileService.getProfile({ 'guid': this.guid }).subscribe(response => {
            this.profile = response.detail;
            if (!this.profile.image) {
               this.apiProfileImageUrl + '/assets/images/pp.jpg';
            } else {
               this.apiProfileImageUrl + this.profile.image;
            }
         })
      }
   }

   onDefaultPage() {
      if (this.isAdmin === 0) {
         this.router.navigate(['/exam/overview']);

      } else if (this.isAdmin === 1) {
         this.router.navigate(['/dashboard/categories']);

      }
   }

   onLogout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('resultsUrl');
      localStorage.removeItem('examSession');
      localStorage.removeItem('submittedTabId');
   }
}