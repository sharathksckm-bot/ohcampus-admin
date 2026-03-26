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
    courseid: any;
    cityname: string;
    id: string;
    map_location: string;
    registraion_type: string;
    statename: string;
    status: string;
    title: string;
    views: string;
}
@Component({
    selector: 'app-addcomedk',
    templateUrl: './addcomedk.component.html',
    styleUrls: ['./addcomedk.component.scss']
})
export class AddcomedkComponent implements OnInit {
    collegeListData: College[];
    comedkForm: FormGroup;
    showLoader: boolean = false;
    addLoader: boolean = false;
    updateLoader: boolean = false;
    subLoader: boolean = false;
    subLoader3: boolean = false;


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
    contentCategoryList: College[];
    contentCategoryList12: any;
    titleids: any;
    collegeid: string;
    retriveData: any;
    id: any;
    CollegeID: any;
    collegeName: any;
    getCategoryListData: any[] = [];
    stateListData: any;
    collegecourseListData: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 1;
    sortValue: string = "desc";
    columnIndex: number = 0;
    years: number[] = [];
    clglist: any[] = [];
    stateLoader : boolean = false;
    stateLoader1: boolean =false;
    collegenamelist: any;
    clgid: any;
    catid: any;
    subLoader2: boolean = false;
    comedk_id: any;
    retriveData1: any;
    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router,
    ) { }

    ngOnInit(): void {
        this.comedkForm = this._formBuilder.group({
            id: [''],
            collegeid: ['', Validators.required],
            category: ['', [Validators.required]],
            search: [''],
            course: [''],
            rank: ['', Validators.required],
            rounded: ['', Validators.required],
            year: ['']

        });
        const routeParams = this._activatedroute.snapshot.params;
        this.comedk_id = routeParams.comedk_id;
        if (routeParams.comedk_id) {
            this.Loader = true
            this.updateButton = true
        }

        this.getClgList()

        this.generateYears()
        this.getCOMEDKDetailsById()
    }
    searchValue() {
        this.getClgList()
    }

    // getClgList() {
    //     this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.comedkForm.value.search).subscribe((res) => {
    //         this.collegeListData = res.data;
    //         this.stateLoader1 = true

    //         console.log(res)
    //         if (res != null || res != '') {
    //             this.stateLoader1 = false
    //         }

    //     });
    // }
getClgList() {
  this.stateLoader1 = true; // Start loader
  this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.comedkForm.value.search).subscribe(
    res => {
      this.collegeListData = res.data;
      this.stateLoader1 = false; // Stop loader on success
    },
    error => {
      console.error(error);
      this.stateLoader1 = false; // Stop loader on error
    }
  );
}
    checkValidInputData(event: any, type) {
        this.globalService.checkValidInputData(event, type);
    }
    generateYears(): void {
        this.subLoader3 = true; // Start loader

        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 100; year--) {
            this.years.push(year);
        }
        this.subLoader3 = false;

    }
    summittableDetails() {
        if (this.comedkForm.status == "INVALID") {
            this.comedkForm.markAllAsTouched();
        } else {
            this.addLoader = true
            let college_id = this.comedkForm.value.collegeid
            let course_id = this.comedkForm.value.course
            let category = this.comedkForm.value.category
            let round = this.comedkForm.value.rounded
            let year = this.comedkForm.value.year
            let rank = this.comedkForm.value.rank
            let id = '';

            this.campusService.insertUpdateCOMEDKCutoff(college_id, course_id, round, category, year, rank, id).subscribe((res) => {
                if (res.response_message == "Success") {
                    this.addLoader = false
                    Swal.fire({
                        text: 'New COMEDKCutoff added successful',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: "#3290d6 !important",
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this._route.navigate(['apps/comedk/comedklist']);
                        }
                    });
                } else {
                    this.addLoader = false
                    Swal.fire('', res.response_message, 'error');
                }
            })
        }

    }

    updatetableDetails() {
        if (this.comedkForm.status == "INVALID") {
            this.comedkForm.markAllAsTouched();
        } else {
            this.updateLoader = true
            let college_id = this.comedkForm.value.collegeid
            let course_id = this.comedkForm.value.course
            let category = this.comedkForm.value.category
            let round = this.comedkForm.value.rounded
            let year = this.comedkForm.value.year
            let rank = this.comedkForm.value.rank
            const routeParams = this._activatedroute.snapshot.params;
            this.comedk_id = routeParams.comedk_id;
            let id = this.comedk_id;
            this.campusService.insertUpdateCOMEDKCutoff(college_id, course_id, round, category, year, rank, id).subscribe((res) => {
                if (res.response_message == "Success") {
                    this.updateLoader = false
                    Swal.fire({
                        text: 'Update COMEDKCutoff added successful',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: "#3290d6 !important",
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this._route.navigate(['apps/comedk/comedklist']);
                        }
                    });
                } else {
                    this.updateLoader = false
                    Swal.fire('', res.response_message, 'error');
                }
            })
        }

    }
    getcollegeListData() {


        var college_id = this.comedkForm.value.collegeid
        if (college_id == '') {
            var college_id = this.clgid;
        }
        this.stateLoader = true
        this.campusService.getCollegeCategory(college_id).subscribe((res) => {
            this.getCategoryListData = res.response_data
            if (res.response_code == 200) {
                this.stateLoader = false
            }
            else{
                this.stateLoader = false

            }
        }
        );

        this.campusService.getCOMEDKDetailsById(this.comedk_id).subscribe((res) => {
            setTimeout(() => {
                if (this.getCategoryListData) {
                    let catname
                    this.getCategoryListData.forEach((item) => {

                        if (item.categoryid == this.retriveData.category_id) {

                            catname = item.categoryid;
                        }
                        this.catid = catname
                    });
                    this.comedkForm.get('contentcategory').setValue(catname);
                }
            }, 2000);
        });

    }



    getCOMEDKDetailsById() {
        const routeParams = this._activatedroute.snapshot.params;
        this.comedk_id = routeParams.comedk_id;
        this.campusService.getCOMEDKDetailsById(this.comedk_id).subscribe((res) => {
            if (res.response_message == "Success") {
                this.retriveData = res.response_data[0];
                this.retriveData1 = res.response_data[0].college_id;
                this.comedkForm.value.search = this.retriveData.collegename;
                this.getClgList();
                setTimeout(() => {
                    let collegeName;
                    if (this.collegeListData) {
                        this.collegeListData.forEach((item) => {
                            if (item.id == this.retriveData.college_id) {
                                collegeName = item.id;
                            }
                        });
                        this.clgid = collegeName
                        this.comedkForm.get('collegeid').setValue(collegeName);
                    }
                }, 2000);
                this.Loader = false
            }
        });
    }


    getCollegeCourses() {
        var college_id;
        if (this.comedkForm.value.collegeid !== "") {
            college_id = this.comedkForm.value.collegeid;
        } else {
            college_id = this.retriveData1;
        }
        let category_id = ""
        this.subLoader2 = true;

        this.campusService.getCollegeCourses(college_id, category_id).subscribe((res) => {
            if (res.response_code === "400") {
                this.collegecourseListData = [];
                this.subLoader2 = false
            } else {
                this.collegecourseListData = res.response_data;
                this.subLoader2 = false
            }
            this.subLoader2 = false

        });
        this.campusService.getCOMEDKDetailsById(this.comedk_id).subscribe((res) => {
            this.retriveData = res.response_data[0];
            this.comedkForm.value.search = this.retriveData.collegename;
            this.comedkForm.get('rounded').setValue(this.retriveData.round);
            this.comedkForm.get('rank').setValue(this.retriveData.rank);
            this.comedkForm.get('category').setValue(this.retriveData.category)
            // Wait for 2 seconds before processing college course list data
            setTimeout(() => {
                console.log("ssss" + this.collegecourseListData);
                if (this.collegecourseListData) {
                    let coursename;
                    this.collegecourseListData.forEach((item) => {
                        if (item.courseid == this.retriveData.course_id) {
                            coursename = item.courseid;
                        }
                    });
                    this.comedkForm.get('course').setValue(coursename);
                }
            }, 2000);
            let year
            this.years.forEach((item) => {
                if (item == this.retriveData.year) {
                    year = item;
                }
            });
            this.comedkForm.get('year').setValue(year)
        });
    }

    back() {
        this._route.navigate(['apps/comedk/comedklist']);
    }

}
