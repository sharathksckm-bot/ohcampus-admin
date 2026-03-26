// import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
// import { CampusService } from 'app/modules/service/campus.service'
// import { FuseValidators } from '@fuse/validators';
// import { GlobalService } from 'app/modules/service/global.service';
// import { MatDialog } from '@angular/material/dialog';
// import Swal from 'sweetalert2';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AngularEditorConfig } from '@kolkov/angular-editor';


// @Component({
//     selector: 'app-tableofcontent',
//     templateUrl: './tableofcontent.component.html',
//     styleUrls: ['./tableofcontent.component.scss']
// })

// export class TableofcontentComponent implements OnInit {
//     @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
//     @Input() collegeDetails: any;
//     @Input() table_content: any;
//     tableForm: FormGroup;
//     showLoader: boolean = false;
//     addLoader: boolean = false;
//     updateLoader: boolean = false;
//     updateButton: boolean = false;
//     Loader: boolean = false;
//     clgId: any;
//     isChecked: any;
//     selectedFaqs: any = [];
//     descriptionData: any;
//     Ids: string;
//     faqslist: any;
//     categoryList: any;
//     selectedContent: any = [];
//     contentCategoryList: any[] = [];
//     contentCategoryList12: any;

//     titleids: any;
//     collegeid: string;
//     retriveData: any;
//     id: any;
//     CollegeID: any;
//     contentcategory: any;
//     changeColleges: any;
//     constructor(
//         private _formBuilder: FormBuilder,
//         private campusService: CampusService,
//         public globalService: GlobalService,
//         public dialog: MatDialog,
//         public _activatedroute: ActivatedRoute,
//         public _route: Router,) { }

//     ngOnInit(): void {
//         this.tableForm = this._formBuilder.group({
//             id: [''],
//             contentcategory: [''],

//         });
//         this.getContentCategory();


//         this.collegeid = this.collegeDetails.id
//         if ((this.collegeid != null)) {
//             this.updateButton = true
//            // this.Loader = true
//             setTimeout(()=>{
//                 this.bindContentCategory();
//             },1000)

//         }

//     }

//     getContentCategory() {
//         this.campusService.getContentCategory().subscribe((res) => {

//             if (res.response_message == "Success") {
//                 this.contentCategoryList = res.contentCategory
//             }
//         })
//     }

//     bindContentCategory(){
//     this.campusService.getTblOfContentById(this.collegeid).subscribe((res) => {
//         let title=[]= res.contentCategory

//         if(this.contentCategoryList != undefined){
//         title.forEach((item) => {
//           this.contentCategoryList.forEach((itemm) => {
//           if (item.title == itemm.id) {
//             this.selectedContent.push(itemm);
//             this.changeSelection;
//           }
//         });
//         this.tableForm.get('contentcategory').setValue(this.selectedContent);
//         this.changeSelection(this.tableForm.value.contentcategory);
//       })
//         }
//       this.Loader = false
//       })
//     }

//     removeCategory(index: number, id: any) {
//         if (id != null) {
//           this.selectedContent = this.selectedContent.filter(item => item.id !== id);
//           const contentControl = this.tableForm.get('contentcategory');
//           if (contentControl) {
//             contentControl.setValue(this.selectedContent);
//           }
//         }
//     }


//     changeSelection(selected) {
//         this.selectedContent = selected;
//     }

//     updatetableDetails() {
//         if (this.selectedContent?.length == 0) {
//             Swal.fire('', 'Please select category', 'error')
//             return
//         }
//         this.updateLoader = true
//         this.titleids = "";
//         this.selectedContent.forEach((item, index) => {

//             const idAsNumber = Number(item.id);
//             this.titleids += idAsNumber;
//             if (index < this.selectedContent.length - 1) {
//                 this.titleids += ",";
//             }
//         });
//         let collegeid = this.tableForm.value.clgId;

//         this.campusService.saveTblOfContent(this.titleids, this.collegeid).subscribe((res) => {
//             if (res.response_message == "Success") {
//                 this.updateLoader = false
//                 Swal.fire({
//                     text: 'Table of content updated successful',
//                     icon: 'success',
//                     showCancelButton: false,
//                     confirmButtonColor: "#3290d6 !important",
//                     confirmButtonText: 'Ok'
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         this._route.navigate(['apps/college/colleges']);
//                     }
//                 });
//             } else {
//                 this.updateLoader = false
//                 Swal.fire('', res.response_message, 'error')
//             }

//         })
//     }



//     back() {
//         this.sendValueToParent();
//     }

//     sendValueToParent() {
//         const valueToSend = "11";
//         this.valueChanged.emit(valueToSend);
//     }


// }
import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
    selector: 'app-tableofcontent',
    templateUrl: './tableofcontent.component.html',
    styleUrls: ['./tableofcontent.component.scss']
})

export class TableofcontentComponent implements OnInit {
    @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
    @Input() collegeDetails: any;
    @Input() table_content: any;
    tableForm: FormGroup;
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
    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router,) { }

    ngOnInit(): void {
        this.tableForm = this._formBuilder.group({
            id: [''],
            contentcategory: [''],

        });


        document.addEventListener('DOMNodeInserted', function () {
            const elements = document.querySelectorAll('[aria-owns]');

            elements.forEach(element => {
              element.removeAttribute('aria-owns');
            });

        });
        this.getContentCategory();


        this.collegeid = this.collegeDetails.id
        if ((this.collegeid != null)) {
            this.updateButton = true
           this.Loader = true
            setTimeout(()=>{
               this.bindContentCategory();
            },1000)

        }

    }

    getContentCategory() {
        this.campusService.getContentCategory().subscribe((res) => {

            if (res.response_message == "Success") {
                this.contentCategoryList = res.contentCategory
                this.Loader = false
            }
        })
    }

    bindContentCategory(){
    this.campusService.getTblOfContentById(this.collegeid).subscribe((res) => {
        // alert(11111)

        if(res.response_code==400) return false ;
        let title=[]= res?.contentCategory
        this.selectedContent = [] ;
        if(this.contentCategoryList != undefined){
        title?.forEach((item) => {

          this.contentCategoryList.forEach((itemm) => {

          if (item.title == itemm.id) {
            this.selectedContent.push(itemm);
            this.changeSelection;
          }
        });
        // console.log(this.selectedContent)
        this.tableForm.get('contentcategory').setValue(this.selectedContent);
        this.changeSelection(this.tableForm.value.contentcategory);
      })
        }
      this.Loader = false
      })
    }

    removeCategory(index: number, id: any) {
        if (id != null) {
          this.selectedContent = this.selectedContent.filter(item => item.id !== id);
          const contentControl = this.tableForm.get('contentcategory');
          if (contentControl) {
            contentControl.setValue(this.selectedContent);
          }
        }
    }


    changeSelection(selected) {
        this.selectedContent = selected;
    }

    updatetableDetails() {
        if (this.selectedContent?.length == 0) {
            Swal.fire('', 'Please select category', 'error')
            return
        }
        this.updateLoader = true
        this.titleids = "";
        this.selectedContent.forEach((item, index) => {

            const idAsNumber = Number(item.id);
            this.titleids += idAsNumber;
            if (index < this.selectedContent.length - 1) {
                this.titleids += ",";
            }
        });
        let collegeid = this.tableForm.value.clgId;
          console.log(this.titleids);
        this.campusService.saveTblOfContent(this.titleids, this.collegeid).subscribe((res) => {
            if (res.response_message == "Success") {
                this.updateLoader = false
                Swal.fire({
                    text: 'Table of content updated successful',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: "#3290d6 !important",
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this._route.navigate(['apps/college/colleges']);
                    }
                });
            } else {
                this.updateLoader = false
                Swal.fire('', res.response_message, 'error')
            }

        })
    }



    back() {
        this.sendValueToParent();
    }

    sendValueToParent() {
        const valueToSend = "12";
        this.valueChanged.emit(valueToSend);
    }


}
