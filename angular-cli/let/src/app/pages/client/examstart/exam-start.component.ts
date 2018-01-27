import { TimerService } from './../../../services/timer.service';
import { Prompts } from './../../../helpers/prompts';
import { BtnActions } from './../../../helpers/btnactions';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Answers } from './../../../models/answers';
import { Question } from './../../../models/question';
import { Subscription } from 'rxjs';
import { Exam } from './../../../models/exam';
import { ExamService } from './../../../services/exam.service';
import { growSlowlyAnimation } from './../../../shared/transitions';
import { Component, OnInit, AfterViewInit, trigger, ViewChild, ElementRef } from '@angular/core';
import { TimerObservable } from "rxjs/observable/TimerObservable";

declare var $: any;

@Component({
  templateUrl: 'exam-start.component.html',
  styleUrls: ['exam-start.component.css'],
  animations: [growSlowlyAnimation]
})

export class ExamStartComponent implements OnInit, AfterViewInit {
  public tabCategories: Exam[];
  public questions: Question[];
  public answers: Answers[] = [];
  public myAnswers: Answers[] = [];
  public sub: Subscription;
  public param: any;
  public answerOptions: any[] = [];
  public studentGuid: string = '';
  public value: number = 0;
  public msgs: any[] = [];
  public btnSubmitText = BtnActions.submit;
  public isEnable: boolean = true;
  public questionArr: any[] = [];
  public timeLimit: string = '';
  public isTimeEnded: boolean = false;
  public blocked: boolean = false;
  public isSubmitted: boolean = false;
  private submittedTabId: any[] = [];

  constructor(private timerService: TimerService, private examService: ExamService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.blocked = true;
    this.timeLimit = `${this.activatedRoute.snapshot.queryParams['t']}:00`;

    if (localStorage.getItem('currentUser') != null) {

      //if refresh redirect back to exam overview
      if (localStorage.getItem('examSession') != null) {
        localStorage.removeItem('examSession');
        this.router.navigate([`/exam/overview`]);
      } else {
        localStorage.setItem('examSession', '1');
      }

      this.studentGuid = JSON.parse(localStorage.getItem('currentUser')).user[0].id;

      this.activatedRoute.params.subscribe(
        params => {
          var majoringId = JSON.parse(localStorage.getItem('currentUser')).user[0].majoring_id;

          var values = {
            majoring_id: majoringId,
            selection: params['selection'],
            guid: this.activatedRoute.snapshot.queryParams['guid']
          }

          this.sub = this.examService.getTabMajoringCategory(values).subscribe(response => {
            this.tabCategories = response.categories;

            const tabs = this.tabCategories;
            const tabNames: any[] = [];

            for (var i in tabs) {
              tabNames.push(tabs[i].name)
            }

            this.sub = this.examService.getExamQuestionsByCategory({ category_majoring: tabNames }).subscribe(response => {
              this.questions = response.questions;

              const questions = this.questions;
              const questionIds: any[] = [];

              for (var i in questions) {
                var idx = 0;
                for (var o in questions[i]) {
                  idx++;
                  questionIds.push(questions[i][o].id)

                  questions[i][o].idx = idx;

                  this.questionArr.push(questions[i][o]);
                }
              }

              this.sub = this.examService.getAnswersByQuestion({ question_ids: questionIds }).subscribe(response => {
                if (response.success === true) {
                  this.answers = response.answers;
                }
              })
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
    }, 500);
  }

  onConfirm() {
    this.isTimeEnded = true;

    $("#myModal").modal('hide');
  }

  onChangeTab(event: any) {
    if (localStorage.getItem('submittedTabId') != null) {
      if (JSON.parse(localStorage.getItem('submittedTabId')).indexOf(event.target.id) === -1) {
        this.isSubmitted = false;
      } else {
        this.isSubmitted = true;
      }

      this.timeLimit = event.target.attributes.timer.value;
    }
  }

  onSubmit(frm: NgForm) {
    var rgroups = [];
    var activeTabId = $(".nav-tabs .active > a").attr("id");

    //check if all question options is selected

    $('input:radio').each(function (index, el) {
      var i;
      for (i = 0; i < rgroups.length; i++) {
        if (rgroups[i] == $(el).attr('name')) {
          return true;
        }
      }
      rgroups.push($(el).attr('name'));
    });

    // if (this.isTimeEnded == false) {
    //   if ($('input:radio:checked').length < rgroups.length) {
    //     alert('You must fill in all the fields.');
    //     return false;
    //   }
    // }

    var student_guid = this.studentGuid;
    var my_answers = this.myAnswers;

    $('input.exam-options').each(function (index) {
      var el = $(this)[0];

      if ($(el).attr('catid') == activeTabId) {
        var answer = {
          id: $(el).attr('id').substr(14),
          guid: '',
          name: $(el).attr('id'),
          iscorrect: $(el).is(':checked'),
          question_id: $(el).attr('name').substr(14),
          student_guid: student_guid,
          my_answer: '',
          my_answer_txt: $(el).attr('selectedanswer')
        }
        my_answers.push(answer);
      }
    });

    //add submitted tab array
    if (this.submittedTabId.indexOf(activeTabId) === -1) {
      this.submittedTabId.push(activeTabId);

      localStorage.setItem('submittedTabId', JSON.stringify(this.submittedTabId));
    }

    this.isSubmitted = true;

    this.sub = this.examService.checkAnswers({ answers: my_answers }).subscribe(response => {
      if (response.success === true) {
        my_answers = [];

        setTimeout(() => {
          if (this.tabCategories.length == JSON.parse(localStorage.getItem('submittedTabId')).length) {  //check if all tabs is submitted
            if (this.param) {
              this.router.navigate([`/exam/results/${this.param}/${response.guid}/${this.activatedRoute.snapshot.queryParams['cid']}`]);
            }

            localStorage.setItem('resultsUrl', JSON.stringify({ 'selection': this.param, 'guid': response.guid }));
          }
        }, 2000);

        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.answerSubmitted });
      }
    })
  }

  ngAfterViewInit() {
    var interval;
    var counter = "0:00";
    counter = this.timeLimit;

    if (counter) {
      interval = setInterval(function () {
        var timer = counter.split(':');

        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;

        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
          seconds = 0;
          minutes = 0;

          $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
          })

          clearInterval(interval);
        }

        seconds = (seconds < 0) ? 59 : seconds;
        var pad = (seconds < 10) ? '0' : '';

        $('.countdown').html(minutes + ':' + pad + seconds);
        counter = minutes + ':' + seconds;
      }, 1000);
    }

    $(document).on('click', '#btn-submit', function () {
      clearInterval(interval);
    })

    $(document).on('click', 'ul li', function () {
      $('li').removeClass('active');

      $(this).addClass('active');
    })

    $('ul li:first-child').trigger('click');

    $(document).on('click', 'input[type=radio]', function () {
      var inputname = $(this).attr('name');
      var answername = $(this).attr('answername');

      //set all to selected answer
      $('input[name=' + inputname + ']').each(function (index) {
        $(this).attr('selectedanswer', answername);
      })
    })

  }
}