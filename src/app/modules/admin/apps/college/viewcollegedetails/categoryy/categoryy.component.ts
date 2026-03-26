import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categoryy',
  templateUrl: './categoryy.component.html',
  styleUrls: ['./categoryy.component.scss']
})
export class CategoryyComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  categoryForm : FormGroup; 
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  page: number = 1;
  pageSize: number = 10;
  columnIndex: number = 1;
  startNum: number = 1;
  sortValue: string = "desc";
  search: string = "";
  retriveData: any;
  categorylist: any;
  selectedItemsList: any;
  checkboxesDataList: any;
  checkedIDs: any[];
  selectedCategories: any = [];
  clgId: any;
  catIds: any ;
  categoryIds: any;
  
  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.getCategoryList()
      this.clgId = this.collegeDetails.id
      this.categoryIds = this.collegeDetails.categoryid.split(',')
    }
    
    ngAfterViewInit(): void {
      if ((this.clgId != null)) {
        this.updateButton = true
      }
    }


    changeSelection(event: any, value) {
    if (event.checked) {
      this.selectedCategories.push(value);
    } else {
      const index = this.selectedCategories.indexOf(value);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  getCategoryList(){
    this.Loader = true
    let type = "college"
    this.campusService.getCategoryListByType(type).subscribe((res) =>{
      this.categorylist = res.response_data

      this.categoryIds.forEach((item) => {
        this.categorylist.forEach((itemm) => {
      
        if (item === itemm.id) {
          itemm.checked = true;
          this.selectedCategories.push(itemm);
          this.selectedCategories;
        }
      });
    })

      this.Loader = false
    })
  }

  sendValueToParent() {
    const valueToSend = "3";
    this.valueChanged.emit(valueToSend);
  }

  updateCategoryForClg(){
    if(this.selectedCategories.length == 0){
      Swal.fire('', 'Please select category' , 'error')
      return
    }
    this.updateLoader = true
    this.catIds = "";
    this.selectedCategories.forEach((item, index) => {
        const idAsNumber = Number(item.id); 
        this.catIds += idAsNumber;
        if (index < this.selectedCategories.length - 1) {
            this.catIds += ",";
        }
    });
    
    this.campusService.updateCategoryForClg(this.catIds,this.clgId).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text: 'College category updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendValueToParent()
          } 
        });
      }else{
        this.updateLoader = false
        Swal.fire('', res.response_message , 'error')
      }
      
    })
  }

  back(){
    this.sendValueToParent2();
  }

  sendValueToParent2() {
    const valueToSend = "1";
    this.valueChanged.emit(valueToSend);
  }
}



