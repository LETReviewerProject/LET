import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionService extends BaseApiService {
   constructor(http: Http) {
      super(http);
   }

   getQuestionByUser(body) {
      return this.post(`getQuestionByUser`, body).map(response => response.json())
         .catch(this.handleServerError)
   }

   getQuestionByResults(body) {
      return this.post(`getQuestionByResults`, body).map(response => response.json())
         .catch(this.handleServerError)
   }

   getQuestionIdsFromResults(body) {
      return this.post(`getQuestionIdsFromResults`, body).map(response => response.json())
         .catch(this.handleServerError)
   }

   getQuestionById(body) {
      return this.post(`getQuestionById`, body).map(response => response.json())
         .catch(this.handleServerError)
   }

   deleteAnswers(id) {
      return this.delete(`deleteAnswers/${id}`).map(response => response.json())
         .catch(this.handleServerError)
   }

   updateAnswers(body) {
      return this.post('updateAnswers', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   getAnswers(body) {
      return this.post('getAnswers', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   insertAnswers(body) {
      return this.post('insertAnswers', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   // handle list of thumbnails to be displayed in home page
   listQuestion() {
      return this.get('getQuestions').map(response => response.json())
         .catch(this.handleServerError)
   }

   createQuestion(body) {
      return this.post('createQuestion', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   updateQuestion(body) {
      return this.put('updateQuestion', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   deleteQuestion(guid) {
      return this.delete(`deleteQuestion/${guid}`).map(response => response.json())
         .catch(this.handleServerError)
   }

}