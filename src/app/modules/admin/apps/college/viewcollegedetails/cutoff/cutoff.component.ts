import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
interface College {
    cityname:string;
    id:string;
    map_location:string;
    registraion_type:string;
    statename:string;
    status:string;
    title:string;
    views:string;
    }
@Component({
  selector: 'app-cutoff',
  templateUrl: './cutoff.component.html',
  styleUrls: ['./cutoff.component.scss']
})
export class CutoffComponent  implements OnInit {
    @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
    @Input() collegeDetails: any;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

    //@Input() table_content: any;
    cutoffForm: FormGroup;
    showLoader: boolean = false;
    addLoader: boolean = false;
    updateLoader: boolean = false;
    updateButton: boolean = false;
    Loader: boolean = false;
    clgId: any;
    isChecked: any;
    selectedFaqs: any = [];
    descriptionData: any;
    Ids: string;
    faqslist: any;
    categoryList: any;
    selectedContent: any = [];
    contentCategoryList: any[] = [];
    contentCategoryList12: any;

    titleids: any;
    collegeid: string;
    retriveData: any;
    id: any;
    CollegeID: any;
    contentcategory: any;
    changeColleges: any;
    panelOpenState = false;
    collegeName: any;
    getCategoryListData: any;
    stateListData: any;
    collegecourseListData: any;
    // college_id: any;
    page: number = 1;
    pageSize: number = 10;
    startNum:  number = 1;
    sortValue: string = "desc";
    columnIndex: number = 0;

    collegeListData: College[];

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router,) { }

    ngOnInit(): void {
        console.log(this.collegeDetails); // Output the received data to the console
        this.cutoffForm = this._formBuilder.group({
            id: [''],
           // collegeName: ['',[Validators.required]],
           collegeid : ['',Validators.required],
            contentcategory: ['', [Validators.required]],
            search : [''],
            course:[''],
            rounded: ['', Validators.required], // Adding the 'required' validator
            oneG: [''],
            oneH: [''],
            oneK: [''],
            oneKH:[''],
            oneR:[''],
            oneRH:[''],
            twoAG:[''],
            twoAH:[''],
            twoAK:[''],
            twoAKH:[''],
            twoAR:[''],
            twoARH:[''],
            twoBG:[''],
            twoBH:[''],
            twoBK:[''],
            twoBKH:[''],
            twoBR:[''],
            twoBRH:[''],
            treeAG:[''],
            treeAH:[''],
            treeAK:[''],
            treeAKH:[''],
            treeAR:[''],
            treeARH:[''],
            treeBG:[''],
            treeBH:[''],
            treeBK:[''],
            treeBKH:[''],
            treeBR:[''],
            treeBRH:[''],
            GM:[''],
            GMH:[''],
            GMK:[''],
            GMKH:[''],
            GMR:[''],
            GMRH:[''],
            SCG:[''],
            SCH:[''],
            SCK:[''],
            SCKH:[''],
            SCR:[''],
            SCRH:[''],
            STG:[''],
            STH:[''],
            STK:[''],
            STKH:[''],
            STR:[''],
            STRH:[''],

        });
        this.getCollegeCategory();
        this.getClgList();
        this.collegeid = this.collegeDetails.id
        console.log("aaa"+ this.collegeid)
        if((this.collegeid!=null) ){
            this.updateButton = true
           //this.Loader = true
        }

    }
    getCollegeCategory(){
        let college_id=this.collegeDetails.id
        this.campusService.getCollegeCategory(college_id).subscribe((res) =>{
           this.getCategoryListData = res.response_data
        })
      }
      searchValue(){
        this.getClgList()
      }
      getClgList(){
        this.campusService.getClgList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.cutoffForm.value.search).subscribe((res) =>{
          this.collegeListData = res.data;
          //this.getDetailsById()
        });
      }
    getCollegeCourses() {
        let category_id = this.cutoffForm.value.contentcategory.categoryid;
        let college_id = this.collegeDetails.id;
        this.campusService.getCollegeCourses(college_id, category_id).subscribe((res) => {
            if (res.response_code === "400") {
                 this.collegecourseListData = [];
             } else {
                this.collegecourseListData = res.response_data;
            }
        });
    }

    binddata(){
        this.collegeName = this.collegeDetails.title



    }
    addApplicationResponse(){
          const dialogRef = this.dialog.open(this.callAPIDialog);
          dialogRef.afterClosed().subscribe((result) => { });
    }
    close() {
        this.dialog.closeAll();
    }


    back() {
        this.sendValueToParent();
    }

    sendValueToParent() {
        const valueToSend = "12";
        this.valueChanged.emit(valueToSend);
    }


}

