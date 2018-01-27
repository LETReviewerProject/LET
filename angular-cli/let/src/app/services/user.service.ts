import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService extends BaseApiService {
  constructor(http: Http) {
    super(http);
  }

  // handle list of thumbnails to be displayed in home page
  listUser() {
    return this.get('getUsers').map(response => response.json())
      .catch(this.handleServerError)
  }

  createUser(body) {
    return this.post('createUser', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  updateUser(body) {
    return this.put('updateUser', body).map(response => response.json())
      .catch(this.handleServerError)
  }

  deleteUser(guid) {
    return this.delete(`deleteUser/${guid}`).map(response => response.json())
      .catch(this.handleServerError)
  }

  activateUser(body) {
    return this.post(`activateUser`, body).map(response => response.json())
      .catch(this.handleServerError)
  }

}