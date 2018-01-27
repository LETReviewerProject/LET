import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService extends BaseApiService {
   constructor(http: Http) {
      super(http);
   }
   
   getCategoriesOnly() {
      return this.get('getCategoriesOnly').map(response => response.json())
         .catch(this.handleServerError)
   }

   getCategoryMajoring() {
      return this.get('getCategoryMajoring').map(response => response.json())
         .catch(this.handleServerError)
   }

   listCategory() {
      return this.get('getCategories').map(response => response.json())
         .catch(this.handleServerError)
   }

   createCategory(body) {
      return this.post('createCategory', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   updateCategory(body) {
      return this.put('updateCategory', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   deleteCategory(guid) {
      return this.delete(`deleteCategory/${guid}`).map(response => response.json())
         .catch(this.handleServerError)
   }

}