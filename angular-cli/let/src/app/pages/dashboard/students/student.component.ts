import { Subscription } from 'rxjs';
import { growSlowlyAnimation } from './../../../shared/transitions';
import { Student } from './../../../models/student';
import { Prompts } from './../../../helpers/prompts';
import { BtnActions } from './../../../helpers/btnactions';
import { ConfirmationService } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { StudentService } from './../../../services/student.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { formState } from './../../../helpers/ae';

@Component({
   templateUrl: 'student.component.html',
   styleUrls: ['student.component.css'],
   animations: [ growSlowlyAnimation ]
})

export class StudentComponent implements OnInit {
   students: Student[] = [];
   selectedRows: any[] = [];
   cols: any[];
   sub: Subscription;
   errorMessage: string;
   display: boolean = false;
   dialogTitle: string = '';

   guid: string = '';
   fullname: string = '';
   school: string = '';
   email: string = '';
   address: string = '';
   contact: string = '';
   user_id: string = '';

   state: number;
   btnAction: string = '';
   msgs: any[] = [];
   isEditDisabled: boolean = true;
   isDeleteDisabled: boolean = true;

   @ViewChild('tblStudent') staleSelections: any;

   constructor(private studentService: StudentService, private confirmationService: ConfirmationService) { }

   ngOnInit() {
      this.cols = [
         { field: 'guid', header: 'ID', style: { 'width': '12px', 'textalign': 'left' } },
         { field: 'fullname', header: 'Name', style: { 'width': '20px', 'textalign': 'left' } },
         { field: 'email', header: 'Email', style: { 'width': '35px', 'textalign': 'left' } },
         { field: 'school', header: 'School', style: { 'width': '40px', 'textalign': 'left' } },
         { field: 'address', header: 'Address', style: { 'width': '50px', 'textalign': 'left' } },
         { field: 'contact', header: 'Contact', style: { 'width': '35px', 'textalign': 'left' } }
      ]

      this.handleStudentlist();
   }

   ngAfterViewInit() {

   }

   addStudent() {
      this.clearForm();

      this.dialogTitle = 'New Student';
      this.display = true;
      this.state = formState.add;
      this.btnAction = BtnActions.save;
   }

   editStudent() {
      this.dialogTitle = 'Edit Student';
      this.display = true;
      this.state = formState.edit;
      this.btnAction = BtnActions.update;

      if (this.selectedRows && this.selectedRows[0]) {
         this.guid = this.selectedRows[0].guid;
         this.fullname = this.selectedRows[0].fullname;
         this.email = this.selectedRows[0].email;
         this.school = this.selectedRows[0].school;
         this.address = this.selectedRows[0].address;
         this.contact = this.selectedRows[0].contact;
      //    this.status = this.selectedRows[0].status;
      }

   }

   onCreateUpdateStudent(frm: NgForm) {
      if (frm && frm.value !== null) {

         if (this.state == formState.add) {
            this.sub = this.studentService.createStudent(frm.value)
               .subscribe(response => {
                  this.students = response.students;

               }, error => this.errorMessage = error)

            this.display = false;
            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.added });

         } else if (this.state == formState.edit) {
            this.sub = this.studentService.updateStudent(frm.value)
               .subscribe(response => {
                  this.students = response.students;

               }, error => this.errorMessage = error)

            this.display = false;
            this.msgs.push({ severity: 'success', summary: 'Success Message', detail: Prompts.updated });

            this.selectedRows = [];
            this.clearForm();
            this.unSelectRows();
         }
      }
   }

   onRefresh() {
      this.handleStudentlist();
   }

   unSelectRows() {
      this.staleSelections.selectedRows = [];
   }

   clearForm() {
      this.guid = '';
      this.fullname = '';
      this.email = '';
      this.school = '';
      this.address = '';
      this.contact = '';
      // this.status = '';
   }

   handleStudentlist() {
      //get categories
      this.sub = this.studentService.listStudent()
         .subscribe(response => {
            this.students = response.students;

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
                  this.sub = this.studentService.deleteStudent(eachObj.guid)
                     .subscribe(response => {
                        this.students = response.students;

                        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: Prompts.deleted });

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