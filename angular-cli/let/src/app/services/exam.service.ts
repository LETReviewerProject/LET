import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ExamService extends BaseApiService {
  constructor(http: Http) {
    super(http);
  }

  getSummaryResults(body) {
    return this.post('getSummaryResults', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  getEarnedPoints(body) {
    return this.post('getEarnedPoints', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  getSumTotalPoints(body) {
    return this.post('getSumTotalPoints', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  getTotalForCategory(body) {
    return this.post('getTotalForCategory', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  checkAnswers(body) {
    return this.post('checkAnswers', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  getAnswersByQuestion(body) {
    return this.post('getAnswersByQuestion', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  getExamCategories() {
    return this.get('getExamByCategories').map(response => response.json())
      .catch(this.handleServerError)
  }

  getTabCategories(body) {
    return this.post('getTabCategories', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  getTabMajoringCategory(body) {
    return this.post('getTabMajoringCategory', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  getExamQuestionsByCategory(body) {
    return this.post('getExamQuestionsByCategory', body).map(response => response.json())
      .catch(this.handleServerError)
  }


}