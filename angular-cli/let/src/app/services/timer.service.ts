import { BaseApiService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class TimerService extends BaseApiService {
   constructor(http: Http) {
      super(http);
   }

   setTimer(body) {
      return this.post('setTimer', body).map(response => response.json())
         .catch(this.handleServerError)
   }

   getTimer() {
      return this.get('getTimer').map(response => response.json())
         .catch(this.handleServerError)
   }
}