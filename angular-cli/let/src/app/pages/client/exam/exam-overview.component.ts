import { Prompts } from './../../../helpers/prompts';
import { TimerService } from './../../../services/timer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Exam } from './../../../models/exam';
import { ExamService } from './../../../services/exam.service';
import { growSlowlyAnimation } from './../../../shared/transitions';
import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

declare var $: any;

@Component({
  templateUrl: 'exam-overview.component.html',
  styleUrls: ['exam-overview.component.css'],
  animations: [growSlowlyAnimation]
})

export class ExamOverviewComponent implements OnInit, AfterViewInit {
  public examOverview: string = 'Exam Overview';
  public categories: Exam[];
  public sub: Subscription;
  public param: any;
  public timeLimit: any;
  public highlightedDiv: number;
  public majoringCategoryGuid: string = '';
  public msgs: any[] = [];

  private majoringCategoryId: string = '';

  constructor(private router: Router, private timerService: TimerService, private examService: ExamService, private activatedRoutes: ActivatedRoute) {
    if (localStorage.getItem('currentUser') != null) {

      localStorage.removeItem('examSession');
      localStorage.removeItem('resultsUrl');

      var majoringId = JSON.parse(localStorage.getItem('currentUser')).user[0].majoring_id;

      this.activatedRoutes.params.subscribe(
        params => {

          if (majoringId === null) {
            this.param = 'secondary';
          } else {
            this.param = 'elementary';
          }

          var values = {
            majoring_id: majoringId,
            selection: this.param
          }

          this.sub = this.examService.getTabCategories(values).subscribe(response => {
            this.categories = response.categories;
          })
        }
      );
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onBeginExam() {
    if (this.majoringCategoryGuid === '' || typeof (this.majoringCategoryGuid) === 'undefined') {
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.selectionError });
      return;
    }
    this.router.navigate([`/exam/start/${this.param}`], { queryParams: { t: this.timeLimit, guid: this.majoringCategoryGuid, cid: this.majoringCategoryId } });
  }

  toggleHighlight(event: any, newValue: number) {
    if (this.highlightedDiv === newValue) {
      this.highlightedDiv = 0;
    } else {
      this.highlightedDiv = newValue;
    }

    this.timeLimit = event.currentTarget.attributes.timer.value;
    this.majoringCategoryGuid = event.currentTarget.attributes.guid.value;
    this.majoringCategoryId = event.currentTarget.attributes.id.value;
  }

}
