import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class StudentService extends BaseApiService {
   constructor(http: Http) {
      super(http);
   }

   isMajoring() {
      return this.get('isMajoring/:guid').map(response => response.json())
   }

   listStudent() {
      return this.get('getStudents').map(response => response.json())
         .catch(this.handleServerError)
   }

   createStudent(body) {
      return this.post('createStudent', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   updateStudent(body) {
      return this.put('updateStudent', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   deleteStudent(guid) {
      return this.delete(`deleteStudent/${guid}`).map(response => response.json())
         .catch(this.handleServerError)
   }

}