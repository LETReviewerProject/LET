import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class TeacherService extends BaseApiService {
   constructor(http: Http) {
      super(http);
   }

   // handle list of thumbnails to be displayed in home page
   listTeacher() {
      return this.get('getTeachers').map(response => response.json())
         .catch(this.handleServerError)
   }

   createTeacher(body) {
      return this.post('createTeacher', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   updateTeacher(body) {
      return this.put('updateTeacher', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   deleteTeacher(guid) {
      return this.delete(`deleteTeacher/${guid}`).map(response => response.json())
         .catch(this.handleServerError)
   }

}