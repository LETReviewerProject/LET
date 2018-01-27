import { Category } from "./../../../models/category";
import { CategoryService } from "./../../../services/categories.service";
import { MajoringService } from "./../../../services/majoring.service";
import { growSlowlyAnimation } from "./../../../shared/transitions";
import { Prompts } from "./../../../helpers/prompts";
import { BtnActions } from "./../../../helpers/btnactions";
import { ConfirmationService } from "primeng/primeng";
import { NgForm } from "@angular/forms";
import { Majoring } from "./../../../models/majoring";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { formState } from "./../../../helpers/ae";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "majoring.component.html",
  styleUrls: ["majoring.component.css"],
  animations: [growSlowlyAnimation]
})
export class MajoringComponent implements OnInit {
  majorings: Majoring[];
  categories: Category[];
  selectedRows: any[] = [];
  cols: any[];
  sub: Subscription;
  errorMessage: string;
  display: boolean = false;
  dialogTitle: string = "";

  guid: string = "";
  name: string = "";
  description: string = "";
  category: string = "";
  category_id: string = "";

  state: number;
  btnAction: string = "";
  msgs: any[] = [];
  isEditDisabled: boolean = true;
  isDeleteDisabled: boolean = true;
  isAdmin: number = 0;
  isTeacher: number = 0;
  majoringId: any;
  userGuid: any;

  @ViewChild("tblMajoring") staleSelections: any;

  constructor(
    private categoryService: CategoryService,
    private majoringService: MajoringService,
    private confirmationService: ConfirmationService
  ) {
    this.isAdmin = JSON.parse(
      localStorage.getItem("currentUser")
    ).user[0].is_admin;
    this.isTeacher = JSON.parse(
      localStorage.getItem("currentUser")
    ).user[0].isteacher;
    this.majoringId = JSON.parse(
      localStorage.getItem("currentUser")
    ).user[0].majoring_id;
    this.userGuid = JSON.parse(
      localStorage.getItem("currentUser")
    ).user[0].id;
  }

  ngOnInit() {
    this.cols = [
      {
        field: "guid",
        header: "ID",
        style: { width: "15px", textalign: "left" }
      },
      {
        field: "name",
        header: "Name",
        style: { width: "30px", textalign: "left" }
      },
      {
        field: "description",
        header: "Description",
        style: { width: "130px", textalign: "left" }
      },
      {
        field: "category",
        header: "Category",
        style: { width: "50px", textalign: "left" }
      }
    ];

    this.handleMajoringlist();

    this.sub = this.categoryService
      .getCategoryMajoring()
      .subscribe(response => {
        this.categories = response.categories;
      });
  }

  ngAfterViewInit() { }

  addMajoring() {
    this.clearForm();

    this.dialogTitle = "New Majoring";
    this.display = true;
    this.state = formState.add;
    this.btnAction = BtnActions.save;
  }

  editMajoring() {
    this.dialogTitle = "Edit Majoring";
    this.display = true;
    this.state = formState.edit;
    this.btnAction = BtnActions.update;

    if (this.selectedRows && this.selectedRows[0]) {
      this.guid = this.selectedRows[0].guid;
      this.name = this.selectedRows[0].name;
      this.description = this.selectedRows[0].description;
      this.category = this.selectedRows[0].category;
    }
  }

  onCreateUpdateMajoring(frm: NgForm) {
    if (frm && frm.value !== null) {
      frm.value["teacher_guid"] = this.userGuid;

      if (this.state == formState.add) {
        this.sub = this.majoringService
          .createMajoring(frm.value)
          .subscribe(() => {
            this.display = false;
            this.msgs.push({ severity: "success", summary: Prompts.added });

            this.clearForm();
            this.onRefresh();
          });

      } else if (this.state == formState.edit) {
        this.sub = this.majoringService
          .updateMajoring(frm.value)
          .subscribe(() => {
            this.display = false;
            this.msgs.push({ severity: "success", summary: Prompts.updated });

            this.clearForm();
            this.onRefresh();
          });
      }
    }
  }

  onRefresh() {
    this.handleMajoringlist();
    this.unSelectRows();
    this.isDeleteDisabled = true;
  }

  unSelectRows() {
    this.staleSelections.selectedRows = [];
  }

  clearForm() {
    this.guid = "";
    this.name = "";
    this.description = "";

    this.selectedRows = [];
    this.unSelectRows();
  }

  handleMajoringlist() {
    if (this.isAdmin == 1) {
      this.sub = this.majoringService.listMajoring().subscribe(response => {
        this.majorings = response.majorings;
      });
    } else if (this.isTeacher == 1) {
      this.sub = this.majoringService
        .getMajorings({ teacher_guid: this.userGuid })
        .subscribe(response => {
          this.majorings = response.majorings;
        });
    }
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
            this.sub = this.majoringService
              .deleteMajoring(eachObj.guid)
              .subscribe(response => {
                if (response.success == true) {
                  this.handleMajoringlist();
                }
              });
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
