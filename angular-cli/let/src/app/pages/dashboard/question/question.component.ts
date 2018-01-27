import { Answers } from './../../../models/answers';
import { Majoring } from './../../../models/majoring';
import { Category } from './../../../models/category';
import { MajoringService } from './../../../services/majoring.service';
import { CategoryService } from './../../../services/categories.service';
import { Subscription } from 'rxjs';
import { growSlowlyAnimation } from './../../../shared/transitions';
import { Prompts } from './../../../helpers/prompts';
import { ConfirmationService } from 'primeng/primeng';
import { QuestionService } from './../../../services/question.service';
import { BtnActions } from './../../../helpers/btnactions';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { formState } from './../../../helpers/ae';
import { Question } from './../../../models/question';

declare var $: any;

@Component({
  templateUrl: 'question.component.html',
  styleUrls: ['question.component.css'],
  animations: [growSlowlyAnimation]
})

export class QuestionComponent implements OnInit, AfterViewInit {
  public questions: Question[] = [];
  public selectedRows: any[] = [];
  public cols: any[];
  public sub: Subscription;
  public errorMessage: string; //TODO: refactor
  public display: boolean = false;
  public dialogTitle: string = '';
  public state: number;
  public btnAction: string = '';
  public msgs: any[] = [];
  public guid: string = '';
  public name: string = '';
  public pts: string = '1';
  public description: string = '';
  public illustration: string = '';
  public categoryMajoring: string = '';
  public categoryMajoringId: string = '';
  public answer_options: Answers[] = [];
  public answer: Answers = new Answers;
  public inputOption: string = '';
  public optionContainer: string = '';
  public edit_view_question_id: string = '';
  public isEditDisabled: boolean = true;
  public isDeleteDisabled: boolean = true;
  public uploadedFiles: any[] = [];
  public categories: Category[];
  public majorings: Majoring[];
  public userGuid: any;
  public isAdmin: any;
  public isTeacher: any;

  @ViewChild('tblQuestion') staleSelections: any;

  constructor(private el: ElementRef, private questionService: QuestionService, private confirmationService: ConfirmationService,
    private categoryService: CategoryService, private majoringService: MajoringService) {

    if (localStorage.getItem('currentUser')) {
      this.userGuid = JSON.parse(localStorage.getItem('currentUser')).user[0].id;
      this.isAdmin = JSON.parse(localStorage.getItem('currentUser')).user[0].is_admin;
      this.isTeacher = JSON.parse(localStorage.getItem('currentUser')).user[0].isteacher;
    }
  }

  ngOnInit() {
    this.cols = [
      { field: 'guid', header: 'ID', style: { 'width': '10px', 'textalign': 'left' } },
      { field: 'name', header: 'Name', style: { 'width': '60px', 'textalign': 'left' } },
      { field: 'pts', header: 'Point', style: { 'width': '20px', 'textalign': 'center' } },
      { field: 'category_majoring', header: 'Category', style: { 'width': '45px', 'textalign': 'left' } }
    ]

    this.handleQuestionlist();

    this.handleCategoryMajoringLists();
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: any) {
    if (event.target.classList.contains('category-majoring-selection')) {
      this.categoryMajoring = event.target.innerText;
    }
  }

  ngAfterViewInit() {
    var count = 1;
    var answer_options = this.answer_options;
    var iscleared = false;

    $(document).on('click', 'ul.dropdown-menu a', function () {
      $(this).closest('.dropdown').find('input.category-majoring').val($(this).text());

      $(this).closest('.dropdown').find('input.category-majoring').attr('id', $(this).attr('id'));
    });

    $(document).on('keypress', 'input.category-majoring', function (e) {
      e.preventDefault();
    });

    $(document).on('click', '#add-option', function () {
      var input = $('input#inputoption').val();
      if (!input || input === '') {
        return false;
      }

      //when editing just adds the existing input count
      var inputcount = $('input[name="answer-option"]').length;
      if (inputcount > 0 && iscleared == false) {
        count += inputcount;
      }

      var option_html = `<div class="col-md-6"><input type="radio" name="answer-option" id="answer-option-${count}" value="${input}">
                              <label class="label-option" for="answer-option-${count}">${input}</label>
                            </div>`;

      count++;

      $('#option-container').append(option_html);
      $('input#inputoption').val('');
      $('input#inputoption').focus();
    })

    $(document).on('click', '#clear-option', function () {
      $('#option-container').html('');
      answer_options = [];
      count = 1;
      iscleared = true;
    })

  }

  handleCategoryMajoringLists() {
    if (this.isAdmin == 1) {
      this.sub = this.majoringService.listMajoring()
        .subscribe(response => {
          this.majorings = response.majorings;
        })
    } else if (this.isTeacher == 1) {
      this.sub = this.majoringService.getMajorings({ teacher_guid: this.userGuid })
        .subscribe(response => {
          this.majorings = response.majorings;
        })
    }

    this.sub = this.categoryService.getCategoriesOnly().subscribe(response => {
       this.categories = response.categories;
    })

  }

  handleQuestionlist() {
    if (this.isAdmin == 1) {
      this.sub = this.questionService.listQuestion()
        .subscribe(response => {
          this.questions = response.questions;
        })

    } else if (this.isTeacher == 1) {
      this.sub = this.questionService.getQuestionByUser({ user_guid: this.userGuid })
        .subscribe(response => {
          this.questions = response.questions;
        })
    }

  }

  onRefresh() {
    this.handleQuestionlist();
    this.unSelectRows();
    this.isDeleteDisabled = true;
  }

  onCollectAnswerOptions() {
    var answer_options = this.answer_options;
    var group = $('input[name="answer-option"]');

    if (group.length > 1) {
      group.each(function () {
        var option = {
          id: '',
          guid: '',
          question_id: '',
          name: $(this).val(),
          iscorrect: $($(this)[0]).is(':checked'),
          my_answer: '',
          my_answer_txt: ''
        }

        answer_options.push(option);
      });
    }
  }

  clearOptions() {
    $('#option-container').html('');
    this.answer_options = [];
  }

  onCreateUpdateQuestion(frm: NgForm) {
    if (frm && frm.value !== null && this.answer_options.length > 0) {

      frm.value['category_majoring'] = $('input[name="categoryMajoringId"]').val();
      frm.value['user_guid'] = this.userGuid;
   
      if (this.state == formState.add) {
        this.sub = this.questionService.createQuestion(frm.value)
          .subscribe(response => {
            this.questions = response.questions;

            //********* insert answer options *********
            for (var i in this.answer_options) {
              this.answer_options[i].question_id = response.insertedId;

              this.sub = this.questionService.insertAnswers(this.answer_options[i]).subscribe();
            }

            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.added });
            this.display = false;

            this.clearOptions();
            this.clearForm();
            frm.reset();

          }, error => {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.generalError });
          })

      } else if (this.state == formState.edit) {
        this.sub = this.questionService.updateQuestion(frm.value)
          .subscribe(response => {
            this.questions = response.questions;

            //delete answers by category id
            this.sub = this.questionService.deleteAnswers(this.edit_view_question_id).subscribe(response => {
              if (response.success === true) {

                for (var i in this.answer_options) {
                  this.answer_options[i].question_id = this.edit_view_question_id;

                  this.sub = this.questionService.updateAnswers(this.answer_options[i]).subscribe();
                }

              }
            });

            this.display = false;
            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.updated });

          }, error => {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.generalError });
            return;
          })
      }

      setTimeout(() => {
        this.selectedRows = [];
        this.unSelectRows();

        this.clearOptions();
        this.clearForm();
        frm.reset();

      }, 2000)
    }
  }

  unSelectRows() {
    this.staleSelections.selectedRows = [];
  }

  addQuestion() {
    this.clearForm();

    this.dialogTitle = 'New Question';
    this.display = true;
    this.state = formState.add;
    this.btnAction = BtnActions.save;
  }

  editQuestion() {
    this.clearForm();

    this.dialogTitle = 'Edit Question';
    this.display = true;
    this.state = formState.edit;
    this.btnAction = BtnActions.update;

    if (this.selectedRows[0]) {
      this.guid = this.selectedRows[0].guid;
      this.name = this.selectedRows[0].name;
      this.pts = this.selectedRows[0].pts;
      this.description = this.selectedRows[0].description;
      this.categoryMajoring = this.selectedRows[0].categoryMajoring
      this.categoryMajoringId = this.selectedRows[0].id;

      $('input#categoryMajoringId').attr('id', this.selectedRows[0].id);

      this.categoryMajoring = this.selectedRows[0].category_majoring;

      //get answers
      if (this.guid) {
        var values = {
          question_guid: this.guid
        }

        this.sub = this.questionService.getQuestionById(values).subscribe(response => {
          if (response.success === true) {
            this.edit_view_question_id = response.question[0].id;

            this.sub = this.questionService.getAnswers(values).subscribe(response => {
              var options = response.answers;

              if (options.length > 0) {
                var count = 1;
                for (var i in options) {
                  var is_checked = options[i].iscorrect == 1 ? 'checked' : '';
                  var option_html = `<div class="col-md-6"><input type="radio" ${is_checked} name="answer-option" question_id="${options[i].question_id}" id="answer-option-${count}" value="${options[i].name}">
                                       <label class="label-option" for="answer-option-${count}">${options[i].name}</label>
                                    </div>`;

                  $('#option-container').append(option_html);
                  count++;
                }
              }
            })
          }
        })
      }
    }
  }

  clearForm() {
    this.guid = '';
    this.name = '';
    this.description = '';
    this.illustration = '';
    this.categoryMajoring = '';
    this.categoryMajoringId = '';
    this.inputOption = '';
    this.answer_options = [];

    $('#option-container').html('');
  }

  handleAllSelection(selections: any) {
    this.selectedRows = selections;

    if (this.selectedRows.length > 0) {
      this.isDeleteDisabled = false;
    } else {
      this.isDeleteDisabled = true;
    }
  }

  handleRowSelect(evt: any) {
    //if checked
    if (evt.originalEvent.checked == true) {
      this.selectedRows.push(evt.data);
    } else { //if unchecked

      var index = this.selectedRows.indexOf(evt.data);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      }
    }

    //enable / disable edt buttn
    if (this.selectedRows.length == 1) {
      this.isEditDisabled = false;
    } else {
      this.isEditDisabled = true;
    }

    //enable / disable delete button
    if (this.selectedRows.length > 0) {
      this.isDeleteDisabled = false;
    } else {
      this.isDeleteDisabled = true;
    }
  }

  onDelete() {
    if (this.selectedRows.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
          this.selectedRows.forEach(eachObj => {
            this.sub = this.questionService.deleteQuestion(eachObj.guid)
              .subscribe(response => {
                this.questions = response.questions;

                this.msgs.push({ severity: 'info', summary: 'Success Message', detail: Prompts.deleted });

                this.handleQuestionlist();
              })
          })
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}