import { Subscription } from "rxjs";
import { growSlowlyAnimation } from "./../../../shared/transitions";
import { BtnActions } from "./../../../helpers/btnactions";
import { Prompts } from "./../../../helpers/prompts";
import { CategoryService } from "./../../../services/categories.service";
import { Category } from "./../../../models/category";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DataTable, ConfirmationService } from "primeng/primeng";
import { formState } from "./../../../helpers/ae";

@Component({
  moduleId: module.id,
  selector: "app-category",
  templateUrl: "category.component.html",
  styleUrls: ["category.component.css"],
  animations: [growSlowlyAnimation]
})
export class CategoryComponent implements OnInit, OnDestroy {
  public categories: Category[];
  public cols: any[];
  public display: boolean = false;
  public dialogTitle: string = '';
  public sub: Subscription;
  public errorMessage: string;
  public msgs: any[] = [];
  public isEditDisabled: boolean = true;
  public isDeleteDisabled: boolean = true;
  public selectedRows: any[] = [];
  public guid: string = '';
  public name: string = '';
  public time_limit: string = '';
  public description: string = '';
  public ismajoring: boolean = false;
  public state: number;
  public btnAction: string = '';
  public timer: string = '';

  @ViewChild("tbCategories") staleSelections: any;

  constructor(private categoryService: CategoryService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.cols = [
      {
        field: "guid",
        header: "ID",
        style: { width: "20px", textalign: "left" }
      },
      {
        field: "name",
        header: "Name",
        style: { width: "30px", textalign: "left" }
      },
      {
        field: "description",
        header: "Description",
        style: { width: "90px", textalign: "left" }
      },
      {
        field: "ismajoring",
        header: "Majoring",
        style: { width: "30px", textalign: "center" }
      },
      {
        field: "timer",
        header: "Timer",
        style: { width: "30px", textalign: "center" }
      }
    ];

    this.handleCategorylist();
  }

  handleCategorylist() {
    this.sub = this.categoryService.listCategory().subscribe(response => {
      this.categories = response.categories;
    });
  }

  onCreateUpdateCategory(frm: NgForm) {
    if (frm && frm.value !== null) {
      if (this.state == formState.add) {
        this.sub = this.categoryService
          .createCategory(frm.value)
          .subscribe(response => {
            this.categories = response.categories;

            this.display = false;
            this.msgs.push({
              severity: "success", summary: "Success Message", detail: Prompts.added
            });

            this.clearForm();
            this.selectedRows = [];
            this.unSelectRows();

          }, error => {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.generalError });
          });

      } else if (this.state == formState.edit) {
        this.sub = this.categoryService
          .updateCategory(frm.value)
          .subscribe(response => {
            this.categories = response.categories;

            this.display = false;
            this.msgs.push({
              severity: "success", summary: "Success Message", detail: Prompts.updated
            });

            this.clearForm();
            this.selectedRows = [];
            this.unSelectRows();

          }, error => {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.generalError });
          });
      }
    }

    this.handleCategorylist();
  }

  //all selections
  handleAllSelection(selections: any) {
    this.selectedRows = selections;

    if (this.selectedRows.length > 0) {
      this.isDeleteDisabled = false;
    } else {
      this.isDeleteDisabled = true;
    }
  }

  handleRowSelect(evt: any) {
    //if checked
    if (evt.originalEvent.checked == true) {
      this.selectedRows.push(evt.data);
    } else {
      //if unchecked
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
        message: "Are you sure that you want to perform this action?",
        accept: () => {
          this.selectedRows.forEach(eachObj => {
            this.sub = this.categoryService
              .deleteCategory(eachObj.guid)
              .subscribe(response => {
                this.categories = response.categories;

                this.msgs.push({
                  severity: "success", summary: Prompts.deleted
                });

                this.clearForm();
                this.selectedRows = [];
                this.unSelectRows();

              }, error => {
                this.msgs.push({ severity: 'error', summary: 'Error Message', detail: Prompts.generalError });
              });
          });
        }
      });
    }
  }

  onRefresh() {
    this.unSelectRows();
    this.handleCategorylist();
  }

  unSelectRows() {
    this.staleSelections.selectedRows = [];
    this.isDeleteDisabled = true;
  }

  clearForm() {
    this.guid = '';
    this.name = '';
    this.time_limit = '';
    this.description = '';
    this.ismajoring = false;
    this.timer = '';
  }

  addCategory() {
    this.clearForm();

    this.dialogTitle = "New Category";
    this.display = true;
    this.state = formState.add;
    this.btnAction = BtnActions.save;
  }

  editCategory() {
    this.dialogTitle = "Edit Category";
    this.display = true;
    this.state = formState.edit;
    this.btnAction = BtnActions.update;

    if (this.selectedRows && this.selectedRows[0]) {
      this.guid = this.selectedRows[0].guid;
      this.name = this.selectedRows[0].name;
      this.time_limit = this.selectedRows[0].time_limit;
      this.description = this.selectedRows[0].description;
      this.timer = this.selectedRows[0].timer;

      if (this.selectedRows[0].ismajoring === "yes") {
        this.ismajoring = true;
      } else {
        this.ismajoring = false;
      }

    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
