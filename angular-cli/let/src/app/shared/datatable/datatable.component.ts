import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
   moduleId: module.id,
   selector: 'app-datatable',
   templateUrl: 'datatable.component.html',
   styleUrls: ['datatable.component.css']
})

export class DataTableComponent implements OnInit {
   @Input() data: any[];
   @Input() cols: any[];
   @Input() iRowCount: number = 10;
   @Input() isMultiple: boolean;

   @Output() evtRowSelection = new EventEmitter();
   @Output() evtAllSelections = new EventEmitter();

   public multiple: boolean = true;
   public selectedRows: any[] = [];
   public loading: boolean;

   constructor() { }

   ngOnInit() {
      if (this.isMultiple == false) {
         this.multiple = this.isMultiple;
      }

      this.loading = true;
      setTimeout(() => {
         this.loading = false;
      }, 1000);
   }

   onRowSelect(row: any) {
      this.evtRowSelection.emit(row);
   }

   onToggleAllRowsSelect(evt: any) {
      this.evtAllSelections.emit(this.selectedRows);
   }

   onRowUnselect(row: any) {
      this.evtRowSelection.emit(row);

   }

   clearSelection() {
      this.selectedRows = [];
   }
}