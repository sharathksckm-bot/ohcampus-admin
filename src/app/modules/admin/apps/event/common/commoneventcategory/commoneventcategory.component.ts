import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commoneventcategory',
  templateUrl: './commoneventcategory.component.html',
  styleUrls: ['./commoneventcategory.component.scss']
})
export class CommoneventcategoryComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() eventDetails: any;
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
  eventsIds: any ;
  eventId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.getCategoryList()
      this.eventId = this.eventDetails.event_id
      this.eventsIds = this.eventDetails.event_category.split(',')
      if(this.eventId != null){
        this.Loader = true
      }
    }

    getCategoryList(){
      this.Loader = true
      let type = "events"
      this.campusService.getCategoryList(type,this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
        this.categorylist = res.data
        this.Loader = false
      })
    }

    ngAfterViewInit(): void {
      if ((this.eventId != null)) {
        this.updateButton = true
        this.getCategoryDetails()
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

    getCategoryDetails(){
      let type = "events"
      this.campusService.getCategoryListByType(type).subscribe((res) =>{

          this.categorylist = res.response_data
          this.eventsIds.forEach((item) => {
            this.categorylist.forEach((itemm) => {

            if (item === itemm.id) {
              itemm.checked = true ;
              this.selectedCategories.push(itemm);
              // this.selectedCategories;
            }
          });
        })

          this.Loader = false
        })
  }

  

    insertCategoryForEvt(){
        if(this.selectedCategories.length == 0){
          Swal.fire('', 'Please select category' , 'error')
          return
        }
        this.addLoader = true
        this.eventsIds = "";
        this.selectedCategories.forEach((item, index) => {
            const idAsNumber = Number(item.id); 
            this.eventsIds += idAsNumber;
            if (index < this.selectedCategories.length - 1) {
                this.eventsIds += ",";
            }
        });
        this.eventId = JSON.parse(localStorage.getItem("postId"));
        this.campusService.updateEventsCategory(this.eventId,this.eventsIds).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.addLoader = false
            Swal.fire({
              text: 'Category added successful',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: "#3290d6 !important",
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                this._route.navigate(['apps/event/viewevents']);
              } 
            });
          }else{
            this.addLoader = false
            Swal.fire('', res.response_message , 'error')
          }
          
        })
      }

      updateCategoryForEvt(){
        if(this.selectedCategories.length == 0){
          Swal.fire('', 'Please select category' , 'error')
          return
        }
        this.updateLoader = true
        this.eventsIds = "";
        this.selectedCategories.forEach((item, index) => {
            const idAsNumber = Number(item.id); 
            this.eventsIds += idAsNumber;
            if (index < this.selectedCategories.length - 1) {
                this.eventsIds += ",";
            }
        });
        
        this.campusService.updateEventsCategory(this.eventId,this.eventsIds).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.updateLoader = false
            Swal.fire({
              text: 'Category updated successful',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: "#3290d6 !important",
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                this._route.navigate(['apps/event/viewevents']);
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

