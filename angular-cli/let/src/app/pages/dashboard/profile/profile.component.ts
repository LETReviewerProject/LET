import { growSlowlyAnimation, slideFromRightAnimation } from './../../../shared/transitions';
import { Results } from './../../../models/results';
import { ExamService } from './../../../services/exam.service';
import { Subscription } from 'rxjs';
import { AppSettings } from './../../../helpers/app.settings';
import { Prompts } from './../../../helpers/prompts';
import { NgForm } from '@angular/forms';
import { Profile } from './../../../models/profile';
import { ProfileService } from './../../../services/profile.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { BtnActions } from './../../../helpers/btnactions';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { formState } from './../../../helpers/ae';
import { FileUploader } from 'ng2-file-upload';

@Component({
   templateUrl: 'profile.component.html',
   styleUrls: ['profile.component.css'],
   animations: [growSlowlyAnimation, slideFromRightAnimation]
})

export class ProfileComponent implements OnInit, AfterViewInit {
   public uploader: FileUploader = new FileUploader({
      url: `${AppSettings.apiUrl}/uploadImage`
   });
   public apiProfileImageUrl = AppSettings.apiProfileImageUrl;
   public profile: Profile = new Profile;
   public cols: any[];
   public errorMessage: string;
   public display: boolean = false;
   public dialogTitle: string = '';
   public state: number;
   public msgs: any[] = [];
   public isBtnBack: boolean = true;
   public sub: Subscription;
   public btnUpdateText: string = BtnActions.update;
   public results: Results[] = [];
   public isTeacher: number = 0;
   public isAdmin: number = 0;
   public studentGuid: any;
   public loading: boolean;
   public screenTitle: string = 'My Profile';

   @ViewChild('selectedphoto') selectedphoto: any;

   constructor(private examService: ExamService, private router: Router,
      private confirmationService: ConfirmationService, private profileService: ProfileService) {
      if (localStorage.getItem('currentUser')) {
         this.isAdmin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;
         this.isTeacher = JSON.parse(localStorage.getItem('currentUser')).user[0].isteacher;
         this.studentGuid = JSON.parse(localStorage.getItem('currentUser')).user[0].id;

         if (this.isAdmin === 0) {
            this.isBtnBack = false;
            //this.router.navigate(['/dashboard/profile']);
         } else if (this.isAdmin === 1) {
            //this.router.navigate(['/dashboard/categories']);
         }

      }
   }

   onGotoDetail(url: any) {
      this.router.navigate([url])
   }

   ngOnInit() {
      this.loading = true;
      setTimeout(() => {
         this.loading = false;
      }, 1500);

      if (this.isTeacher == 1) {
         this.cols = [
            { field: 'guid', header: 'ID', style: { 'width': '15px', 'textalign': 'left' } },
            { field: 'studentname', header: 'Student', style: { 'width': '50px', 'textalign': 'left' } },
            { field: 'url', header: 'Details', style: { 'width': '50px', 'textalign': 'left' } }
         ]

         if (this.studentGuid) {
            this.sub = this.profileService.getStudentListSummary({ guid: this.studentGuid }).subscribe(response => {
               if (response.success == true) {
                  this.results = response.rows;
               }
            })
         }

      } else {
         this.cols = [
            { field: 'guid', header: 'ID', style: { 'width': '5px', 'textalign': 'left' } },
            { field: 'category', header: 'Category', style: { 'width': '20px', 'textalign': 'left' } },
            { field: 'questionname', header: 'Question Name', style: { 'width': '60px', 'textalign': 'left' } },
            { field: 'pts', header: 'Pts Possible', style: { 'width': '20px', 'textalign': 'center' } },
            { field: 'total', header: 'Pts Earned', style: { 'width': '20px', 'textalign': 'center' } },
            { field: 'remark', header: 'Remark', style: { 'width': '20px', 'textalign': 'center' } },
            { field: 'examdate', header: 'Date Taken', style: { 'width': '35px', 'textalign': 'center' } }
         ]

         if (this.studentGuid) {
            this.sub = this.examService.getSummaryResults({ student_guid: this.studentGuid }).subscribe(response => {
               if (response.success == true) {
                  this.results = response.results;
               }
            })
         }
      }

   }

   ngAfterViewInit() {
      this.getProfileDetail();
   }

   getProfileDetail() {
      if (localStorage.getItem('currentUser') !== null) {
         let guid = JSON.parse(localStorage.getItem('currentUser')).user[0].id;

         this.sub = this.profileService.getProfile({ 'guid': guid }).subscribe(response => {
            this.profile = response.detail;
         })
      }
   }

   onUpdateProfile(frm: NgForm) {
      if (this.isTeacher == 1) {
         frm.value['isteacher'] = 1;
      } else if (this.isTeacher == 0) {
         frm.value['isteacher'] = 0;
      }

      if (this.uploader.queue.length > 0) {
         this.uploader.onBuildItemForm = function (fileItem, form) {
            form.append('guid', frm.value.guid); return { fileItem, form }
         };
      }

      this.btnUpdateText = BtnActions.updating;
      this.sub = this.profileService.updateProfile(frm.value).subscribe(response => {
         if (response.success == true) {
            if (this.uploader.queue.length > 0) {
               this.uploader.queue[0].upload();
            }

            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.updated });

            setTimeout(() => {
               this.selectedphoto.nativeElement.value = '';
               this.btnUpdateText = BtnActions.update;
               this.display = false;
            }, 2000);

         }
      })
   }

   editProfile() {
      this.dialogTitle = 'Update Profile';
      this.display = true;
      this.state = formState.edit;
      this.btnUpdateText = BtnActions.update;


   }
}