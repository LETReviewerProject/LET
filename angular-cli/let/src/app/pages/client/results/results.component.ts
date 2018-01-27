import { Category } from './../../../models/category';
import { QuestionService } from './../../../services/question.service';
import { growSlowlyAnimation } from './../../../shared/transitions';
import { Prompts } from './../../../helpers/prompts';
import { BtnActions } from './../../../helpers/btnactions';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Answers } from './../../../models/answers';
import { Question } from './../../../models/question';
import { Subscription } from 'rxjs';
import { Exam } from './../../../models/exam';
import { ExamService } from './../../../services/exam.service';
import { Component, OnInit, AfterViewInit, trigger, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';

declare var $: any;

@Component({
  templateUrl: 'results.component.html',
  styleUrls: ['results.component.css'],
  animations: [growSlowlyAnimation,]
})

export class ResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  public tabCategories: Category[];
  public questions: Question[];
  public answers: Answers[] = [];
  public myAnswers: Answers[] = [];
  public sub: Subscription;
  public param: any;
  public answer_options: any[] = [];
  public studentGuid: string = '';
  public value: number = 0;
  public msgs: any[] = [];
  public btnSubmitText = BtnActions.submit;
  public isEnable: boolean = true;
  public tabs: any = [];
  public categoryNamePoints = [];
  public categoryScore: Category[] = [];
  public category_total_score: number;
  public category_earned_score: number;
  public blocked: boolean = false;
  public categoryName: string = '';

  constructor(private elRef: ElementRef, private examService: ExamService, private questioNService: QuestionService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.blocked = true;

    if (localStorage.getItem('currentUser') != null) {
      this.studentGuid = JSON.parse(localStorage.getItem('currentUser')).user[0].id;

      this.activatedRoute.params.subscribe(
        params => {
          this.categoryName = params['c'];

          if (!params['selection']) {
            this.router.navigate(['/exam/overview']);
          }

          var majoringId = JSON.parse(localStorage.getItem('currentUser')).user[0].majoring_id;

          var values = {
            majoring_id: majoringId,
            selection: params['selection']
          }

          this.sub = this.examService.getTabCategories(values).subscribe(response => {

            const tabs = response.categories;
            const tabNames: any[] = [];

            for (var i in tabs) {
              tabNames.push(tabs[i].name);
              this.categoryNamePoints.push(tabs[i].name)
            }

            const categoryGuidParams = { exam_guid: params['guid'], category_names: this.categoryNamePoints };

            this.sub = this.examService.getTotalForCategory(categoryGuidParams).subscribe(response => {
              if (response.success == true) {
                this.categoryScore = response.category_score;
              }
            })

            this.sub = this.examService.getSumTotalPoints(categoryGuidParams)
              .subscribe(response => {
                if (response.success == true) {
                  this.category_total_score = response.total_score;

                }
              })

            this.sub = this.examService.getEarnedPoints(categoryGuidParams)
              .subscribe(response => {
                if (response.success == true) {
                  this.category_earned_score = response.earned_score;
                }
              })

            //filter category by id
            this.tabCategories = response.categories;
            this.tabCategories = this.tabCategories.filter(function (el) {
              return el.id == params['cid']
            });

            this.sub = this.questioNService.getQuestionIdsFromResults({ guid: params['guid'], student_guid: this.studentGuid })
              .subscribe(response => {
                if (response.success === true) {
                  this.sub = this.questioNService.getQuestionByResults(
                    {
                      question_ids: response.questionids,
                      category_names: tabNames,
                      exam_guid: params['guid']
                    }
                  ).subscribe(response => {
                    this.questions = response.questions;

                    const questions = this.questions;
                    const questionIds: any[] = [];

                    for (var i in questions) {
                      questionIds.push(questions[i].id)
                    }

                    this.sub = this.examService.getAnswersByQuestion({ question_ids: questionIds }).subscribe(response => {
                      if (response.success === true) {
                        this.answers = response.answers;
                      }
                    })
                  });
                }
              })
          })
          this.param = params['selection'];
        }
      );
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.blocked = false;
    }, 1000);

  }

  getEl(el: any) {
    var panel = el.parentElement.parentElement.children[1];

    if (el.classList.contains('panel-collapsed')) {
      el.classList.remove('panel-collapsed');

      panel.classList.remove('open-container');
      panel.classList.add('close-container');

    } else {
      el.classList.add('panel-collapsed');

      panel.classList.remove('close-container');
      panel.classList.add('open-container');
    }

    return false;
  }

  ngAfterViewInit() {
    $(document).on('click', '.accordion-toggle', function () {
      $(this).children().first().children().toggleClass('fa-chevron-down fa-chevron-right');
    });
  }

  onTerminateExamSession() {
    localStorage.removeItem('examSession');
    localStorage.removeItem('resultsUrl');
    localStorage.removeItem('submittedTabId');

    this.router.navigate(['/exam/overview']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
