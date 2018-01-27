import { Exam } from './../../../models/exam';
import { growSlowlyAnimation, slideFromRightAnimation } from './../../../shared/transitions';
import { Results } from './../../../models/results';
import { ExamService } from './../../../services/exam.service';
import { Subscription } from 'rxjs';
import { AppSettings } from './../../../helpers/app.settings';
import { Prompts } from './../../../helpers/prompts';
import { NgForm } from '@angular/forms';
import { Profile } from './../../../models/profile';
import { ProfileService } from './../../../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { BtnActions } from './../../../helpers/btnactions';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


@Component({
   templateUrl: 'results-detail.component.html',
   styleUrls: ['results-detail.component.css'],
   animations: [growSlowlyAnimation, slideFromRightAnimation]
})

export class ResultDetailComponent implements OnInit, AfterViewInit {
   apiProfileImageUrl = AppSettings.apiProfileImageUrl;
   profile: Profile = new Profile;
   cols: any[];
   errorMessage: string;
   display: boolean = false;
   dialogTitle: string = '';
   state: number;
   msgs: any[] = [];
   sub: Subscription;
   results: Results[] = [];
   isteacher: any;
   is_admin: any;
   userId: any;
   student_guid: any;

   constructor(private router: Router, private activatedRoute: ActivatedRoute, private examService: ExamService,
      private confirmationService: ConfirmationService, private profileService: ProfileService) {

         this.student_guid = this.activatedRoute.snapshot.params['guid'];

         this.cols = [
            { field: 'guid', header: 'ID', style: { 'width': '15px', 'textalign': 'left' } },
            { field: 'category', header: 'Category', style: { 'width': '20px', 'textalign': 'left' } },
            { field: 'questionname', header: 'Question', style: { 'width': '50px', 'textalign': 'left' } },
            { field: 'examdate', header: 'Date Taken', style: { 'width': '30px', 'textalign': 'left' } },
            { field: 'pts', header: 'Pts Possible', style: { 'width': '25px', 'textalign': 'center' } },
            { field: 'total', header: 'pts Earned', style: { 'width': '25px', 'textalign': 'center' } },
            { field: 'remark', header: 'Remark', style: { 'width': '30px', 'textalign': 'center' } }
         ]

         this.sub = this.examService.getSummaryResults({ student_guid: this.student_guid }).subscribe(response => {
            if (response.success == true) {
               this.results = response.results;
            }
         })


   }

   ngOnInit() {

   }

   ngAfterViewInit() {
      this.getProfileDetail();
   }

   getProfileDetail() {
      if (this.student_guid !== null) {
         this.sub = this.profileService.getProfile({ 'guid': this.student_guid }).subscribe(response => {
            this.profile = response.detail;
         })
      }
   }

}