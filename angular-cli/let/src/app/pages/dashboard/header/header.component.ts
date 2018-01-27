import { Subscription } from 'rxjs';
import { AppSettings } from './../../../helpers/app.settings';
import { Profile } from './../../../models/profile';
import { ProfileService } from './../../../services/profile.service';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
   moduleId: module.id,
   selector: 'app-dashboard-header',
   templateUrl: 'header.component.html',
   styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit, AfterViewInit {
   profile: Profile = new Profile;
   sub: Subscription;
   apiProfileImageUrl = AppSettings.apiProfileImageUrl;
   isteacher: number = 0;
   isadmin: number = 0;
   guid: any;

   constructor(private router: Router, private profileService: ProfileService) { }

   ngOnInit() {
      if (localStorage.getItem('currentUser')) {
         this.isadmin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;
         this.isteacher = JSON.parse(localStorage.getItem('currentUser')).user[0].isteacher;
         this.guid = JSON.parse(localStorage.getItem('currentUser')).user[0].id;

         if (this.isadmin === 0 && this.isteacher == 0) {
            this.router.navigate(['/exam/overview']);
         }
      }
   }

   ngAfterViewInit() {
      this.sub = this.profileService.getProfile({ 'guid': this.guid }).subscribe(response => {
         this.profile = response.detail;
         if (!this.profile.image) {
            this.apiProfileImageUrl + '/assets/images/pp.jpg';
         } else {
            this.apiProfileImageUrl + this.profile.image;
         }
      })
   }

   onLogout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('resultsUrl');
      localStorage.removeItem('examSession');
   }
}