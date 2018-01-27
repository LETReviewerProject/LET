import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService extends BaseApiService {
   constructor(http: Http) {
      super(http);
   }

   getStudentListSummary(body) {
      return this.post('getStudentListSummary', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   getProfile(body) {
      return this.post('getProfileDetail', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   updateProfile(body) {
      return this.post('updateProfile', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   uploadImage(formData) {
      return this.upload('uploadImage', formData).map(response => response.json())
         .catch(this.handleServerError)
   }
}