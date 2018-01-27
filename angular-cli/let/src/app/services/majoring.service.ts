import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class MajoringService extends BaseApiService {
   constructor(http: Http) {
      super(http);
   }

   listMajoring() {
      return this.get('getMajorings').map(response => response.json())
         .catch(this.handleServerError)
   }

   getMajorings(body) {
      return this.post('getMajoringByTeacher', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   createMajoring(body) {
      return this.post('createMajoring', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   updateMajoring(body) {
      return this.put('updateMajoring', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   deleteMajoring(guid) {
      return this.delete(`deleteMajoring/${guid}`).map(response => response.json())
         .catch(this.handleServerError)
   }

}