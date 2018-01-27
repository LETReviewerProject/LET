import { Majoring } from './../../../models/majoring';
import { MajoringService } from './../../../services/majoring.service';
import { Subscription } from 'rxjs';
import { growSlowlyAnimation } from './../../../shared/transitions';
import { Prompts } from './../../../helpers/prompts';
import { BtnActions } from './../../../helpers/btnactions';
import { ConfirmationService } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { Teacher } from './../../../models/teacher';
import { TeacherService } from './../../../services/teacher.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { formState } from './../../../helpers/ae';

@Component({
   moduleId: module.id,
   templateUrl: 'teacher.component.html',
   styleUrls: ['teacher.component.css'],
   animations: [growSlowlyAnimation]
})

export class TeacherComponent implements OnInit {
   teachers: Teacher[];
   selectedRows: any[] = [];
   cols: any[];
   sub: Subscription;
   errorMessage: string;
   display: boolean = false;
   dialogTitle: string = '';

   guid: string = '';
   fullname: string = '';
   address: string = '';
   contact: string = '';
   email: string = '';
   majoringname: string = '';
   majoring_id: string = '';
   majorings: Majoring[];

   state: number;
   btnAction: string = '';
   msgs: any[] = [];
   isEditDisabled: boolean = true;
   isDeleteDisabled: boolean = true;

   @ViewChild('tblTeacher') staleSelections: any;

   constructor(private majoringService: MajoringService, private teacherService: TeacherService, private confirmationService: ConfirmationService) {
      this.sub = this.majoringService.listMajoring().subscribe(response => {
         if (response.success === true) {
            this.majorings = response.majorings;
         }
      })
   }

   ngOnInit() {
      this.cols = [
         { field: 'guid', header: 'ID', style: { 'width': '12px', 'textalign': 'left' } },
         { field: 'fullname', header: 'Fullname', style: { 'width': '20px', 'textalign': 'left' } },
         { field: 'address', header: 'Address', style: { 'width': '40px', 'textalign': 'left' } },
         { field: 'contact', header: 'contact', style: { 'width': '25px', 'textalign': 'left' } },
         { field: 'email', header: 'Email', style: { 'width': '50px', 'textalign': 'left' } },
         { field: 'majoringname', header: 'Majoring', style: { 'width': '30px', 'textalign': 'left' } }
      ]

      this.handleTeacherlist();
   }

   ngAfterViewInit() {

   }

   addTeacher() {
      this.clearForm();

      this.dialogTitle = 'New Teacher';
      this.display = true;
      this.state = formState.add;
      this.btnAction = BtnActions.save;
   }

   editTeacher() {
      this.dialogTitle = 'Edit Teacher';
      this.display = true;
      this.state = formState.edit;
      this.btnAction = BtnActions.update;

      if (this.selectedRows && this.selectedRows[0]) {
         this.guid = this.selectedRows[0].guid;
         this.fullname = this.selectedRows[0].fullname;
         this.address = this.selectedRows[0].address;
         this.email = this.selectedRows[0].email;
         this.contact = this.selectedRows[0].contact;
         this.majoringname = this.selectedRows[0].majoringname;
      }

   }

   onCreateUpdateTeacher(frm: NgForm) {
      if (frm && frm.value !== null) {

         if (this.state == formState.add) {
            this.sub = this.teacherService.createTeacher(frm.value)
               .subscribe(response => {
                  this.teachers = response.teachers;

               }, error => this.errorMessage = error)

            this.display = false;
            this.msgs.push({ severity: 'success', summary: Prompts.added });

         } else if (this.state == formState.edit) {
            this.sub = this.teacherService.updateTeacher(frm.value)
               .subscribe(response => {
                  this.teachers = response.teachers;

               }, error => this.errorMessage = error)

            this.display = false;
            this.msgs.push({ severity: 'success', summary: Prompts.updated });

            this.selectedRows = [];
            this.clearForm();
            this.unSelectRows();
         }
      }
   }

   onRefresh() {
      this.handleTeacherlist();
   }

   unSelectRows() {
      this.staleSelections.selectedRows = [];
   }

   clearForm() {
      this.guid = '';
      this.fullname = '';
      this.address = '';
      this.contact = '';
      this.email = '';
      this.majoringname = '';
      this.majoring_id = '';
   }

   handleTeacherlist() {
      //get categories
      this.sub = this.teacherService.listTeacher()
         .subscribe(response => {
            this.teachers = response.teachers;

         }, error => this.errorMessage = error)
   }

   //all selections
   handleAllSelection(selections: any) {
      this.selectedRows = selections;
   }

   handleRowSelect(evt: any) {
      //if checked
      if (evt.originalEvent.checked == true) {
         this.selectedRows.push(evt.data);
      } else { //if unchecked

         var index = this.selectedRows.indexOf(evt.data);
         if (index > -1) {
            this.selectedRows.splice(index, 1);
         }
      }

      //enable / disable edt buttn
      if (this.selectedRows.length == 1) {
         this.isEditDisabled = false;
      } else {
         this.isEditDisabled = true;
      }

      //enable / disable delete button
      if (this.selectedRows.length > 0) {
         this.isDeleteDisabled = false;
      } else {
         this.isDeleteDisabled = true;
      }
   }

   onDelete() {
      if (this.selectedRows.length > 0) {
         this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
               this.selectedRows.forEach(eachObj => {
                  this.sub = this.teacherService.deleteTeacher(eachObj.guid)
                     .subscribe(response => {
                        this.teachers = response.teachers;

                        this.msgs.push({ severity: 'info', summary: Prompts.deleted });

                        this.selectedRows = [];
                        this.unSelectRows();

                     }, error => this.errorMessage = error)

               })
            }
         });
      }
   }


   ngOnDestroy() {
      this.sub.unsubscribe();
   }
}