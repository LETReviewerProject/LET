import { TimerService } from './../../../services/timer.service';
import { Subscription } from 'rxjs';
import { growSlowlyAnimation } from './../../../shared/transitions';
import { Prompts } from './../../../helpers/prompts';
import { BtnActions } from './../../../helpers/btnactions';
import { NgForm } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { formState } from './../../../helpers/ae';

declare var $: any;

@Component({
   templateUrl: 'timer.component.html',
   styleUrls: ['timer.component.css'],
   animations: [growSlowlyAnimation]
})

export class TimerComponent implements OnInit, AfterViewInit {
   time_limit: any;
   btnAction: string = BtnActions.update;
   sub: Subscription;
   msgs: any[] = [];

   constructor(private timerService: TimerService) {

   }

   ngOnInit() {
      this.sub = this.timerService.getTimer().subscribe(response => {
         this.time_limit = response.timer.time;
      })
   }

   onSubmit(frm: NgForm) {
      if (frm && frm.value !== null) {
         this.sub = this.timerService.setTimer(frm.value).subscribe(response => {
            if (response.success == true) {
               this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.updated });
            }
         }, error => {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.generalError });
         })
      }
   }

   ngAfterViewInit() {

   }
}