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
    selector: 'app-addkcetcutoff',
    templateUrl: './addkcetcutoff.component.html',
    styleUrls: ['./addkcetcutoff.component.scss']
})
export class AddkcetcutoffComponent implements OnInit {
    collegeListData: College[];
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
    contentCategoryList: College[];
    contentCategoryList12: any;

    titleids: any;
    collegeid: string;
    retriveData: any;
    id: any;
    CollegeID: any;
    contentcategory: any;
    changeColleges: any;
    panelOpenState: boolean = false;
    panelOpenState1: boolean = false;
    panelOpenState2: boolean = false;
    panelOpenState3: boolean = false;
    panelOpenState4: boolean = false;
    panelOpenState5: boolean = false;
    panelOpenState6: boolean = false;
    panelOpenState7: boolean = false;
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
    cutoffid: any;
    clglist: any[] = [];
    subLoader1: boolean = false
    collegenamelist: any;
    clgid: any;
    catid: any;
    subLoader2: boolean = false;
    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router,
    ) { }
    ngOnInit(): void {
        this.cutoffForm = this._formBuilder.group({
            id: [''],
            collegeid: ['', Validators.required],
            contentcategory: ['', [Validators.required]],
            search: [''],
            course: [''],
            rounded: ['', Validators.required], // Adding the 'required' validator
            oneG: [''],
            oneH: [''],
            oneK: [''],
            oneKH: [''],
            oneR: [''],
            oneRH: [''],
            twoAG: [''],
            twoAH: [''],
            twoAK: [''],
            twoAKH: [''],
            twoAR: [''],
            twoARH: [''],
            twoBG: [''],
            twoBH: [''],
            twoBK: [''],
            twoBKH: [''],
            twoBR: [''],
            twoBRH: [''],
            treeAG: [''],
            treeAH: [''],
            treeAK: [''],
            treeAKH: [''],
            treeAR: [''],
            treeARH: [''],
            treeBG: [''],
            treeBH: [''],
            treeBK: [''],
            treeBKH: [''],
            treeBR: [''],
            treeBRH: [''],
            GM: [''],
            GMH: [''],
            GMK: [''],
            GMKH: [''],
            GMR: [''],
            GMRH: [''],
            SCG: [''],
            SCH: [''],
            SCK: [''],
            SCKH: [''],
            SCR: [''],
            SCRH: [''],
            STG: [''],
            STH: [''],
            STK: [''],
            STKH: [''],
            STR: [''],
            STRH: [''],
            year: ['']

        });

        const routeParams = this._activatedroute.snapshot.params;
        this.cutoffid = routeParams.cutoff_id;
        if (routeParams.cutoff_id) {
            this.updateButton = true
        }
      //  this.getClgList()
        this.generateYears()
        this.getDetailsById()
        this.cutoffForm.get('contentcategory').valueChanges.subscribe(categoryId => {
            if (categoryId) {
                this.getCollegeCourses();
            }
        });


    }

    // Function to handle panel close event
    panelClosed() {
        this.panelOpenState = false;
     }
    panelOpened() {
        this.panelOpenState = true;
    }
    panelClosed1() {
        this.panelOpenState1 = false;
    }
    panelOpened1() {
        this.panelOpenState1 = true;
    }
    panelClosed2() {
        this.panelOpenState2 = false;
    }
    panelOpened2() {
        this.panelOpenState2 = true;
    }
    panelClosed3() {
        this.panelOpenState3 = false;
    }
    panelOpened3() {
        this.panelOpenState3 = true;
    }
    panelClosed4() {
        this.panelOpenState4 = false;
    }
    panelOpened4() {
        this.panelOpenState4 = true;
    }
    panelClosed5() {
        this.panelOpenState5 = false;
    }
    panelOpened5() {
        this.panelOpenState5 = true;
    }
    panelClosed6() {
        this.panelOpenState6 = false;
    }
    panelOpened6() {
        this.panelOpenState6 = true;
    }
    panelClosed7() {
        this.panelOpenState7 = false;
    }
    panelOpened7() {
        this.panelOpenState7 = true;
    }
    searchValue() {
        this.getClgList()
    }
    getClgList() {
        this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.cutoffForm.value.search).subscribe((res) => {
            this.collegeListData = res.data;
           console.log("qqqq"+JSON.stringify( this.collegeListData));

            if (res != null || res != '') {
                this.subLoader1 = true
                this.subLoader1 = false
            }

        });
    }

    checkValidInputData(event: any, type) {
        this.globalService.checkValidInputData(event, type);
    }

    generateYears(): void {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 100; year--) {
            this.years.push(year);
        }
    }

    summittableDetails() {
        if (this.cutoffForm.status == "INVALID") {
            //this.cutoffForm.markAllAsTouched();
            // Swal.fire('', 'Please fill all mandatory data', 'error')
            // return
        } else {
            // if (this.cutoffForm.value.careerDocument_FrontFilePath == '') {
            //     Swal.fire('', 'Please upload document', 'error')
            //     return
            // }
            this.addLoader = true
            let college_id = this.cutoffForm.value.collegeid
            let round = this.cutoffForm.value.rounded
            let course_id = this.cutoffForm.value.course
            let category_id = this.cutoffForm.value.contentcategory
            let oneG = this.cutoffForm.value.oneG
            let oneH = this.cutoffForm.value.oneH
            let oneK = this.cutoffForm.value.oneK
            let oneKH = this.cutoffForm.value.oneKH
            let oneR = this.cutoffForm.value.oneR
            let oneRH = this.cutoffForm.value.oneRH
            let twoAG = this.cutoffForm.value.twoAG
            let twoAH = this.cutoffForm.value.twoAH
            let twoAK = this.cutoffForm.value.twoAK
            let twoAKH = this.cutoffForm.value.twoAKH
            let twoAR = this.cutoffForm.value.twoAR
            let twoARH = this.cutoffForm.value.twoARH
            let twoBG = this.cutoffForm.value.twoBG
            let twoBH = this.cutoffForm.value.twoBH
            let twoBK = this.cutoffForm.value.twoBK
            let twoBKH = this.cutoffForm.value.twoBKH
            let twoBR = this.cutoffForm.value.twoBR
            let twoBRH = this.cutoffForm.value.twoBRH
            let treeAG = this.cutoffForm.value.treeAG
            let treeAH = this.cutoffForm.value.treeAH
            let treeAK = this.cutoffForm.value.treeAK
            let treeAKH = this.cutoffForm.value.treeAKH
            let treeAR = this.cutoffForm.value.treeAR
            let treeARH = this.cutoffForm.value.treeARH
            let treeBG = this.cutoffForm.value.treeBG
            let treeBH = this.cutoffForm.value.treeBH
            let treeBK = this.cutoffForm.value.treeBK
            let treeBKH = this.cutoffForm.value.treeBKH
            let treeBR = this.cutoffForm.value.treeBR
            let treeBRH = this.cutoffForm.value.treeBRH
            let GM = this.cutoffForm.value.GM
            let GMH = this.cutoffForm.value.GMH
            let GMK = this.cutoffForm.value.GMK
            let GMKH = this.cutoffForm.value.GMKH
            let GMR = this.cutoffForm.value.GMR
            let GMRH = this.cutoffForm.value.GMRH
            let SCG = this.cutoffForm.value.SCG
            let SCH = this.cutoffForm.value.SCH
            let SCK = this.cutoffForm.value.SCK
            let SCKH = this.cutoffForm.value.SCKH
            let SCR = this.cutoffForm.value.SCR
            let SCRH = this.cutoffForm.value.SCRH
            let STG = this.cutoffForm.value.STG
            let STH = this.cutoffForm.value.STH
            let STK = this.cutoffForm.value.STK
            let STKH = this.cutoffForm.value.STKH
            let STR = this.cutoffForm.value.STR
            let STRH = this.cutoffForm.value.STRH
            let year = this.cutoffForm.value.year


            this.campusService.insertKCETCutoff(college_id, round, course_id, category_id, year, oneG, oneH, oneK, oneKH, oneR, oneRH, twoAG, twoAH, twoAK, twoAKH, twoAR, twoARH,
                twoBG, twoBH, twoBK, twoBKH, twoBR, twoBRH, treeAG, treeAH, treeAK, treeAKH, treeAR, treeARH, treeBG, treeBH, treeBK, treeBKH, treeBR, treeBRH, GM, GMH, GMK, GMKH,
                GMR, GMRH, SCG, SCH, SCK, SCKH, SCR, SCRH, STG, STH, STK, STKH, STR, STRH).subscribe((res) => {
                    if (res.response_message == "Success") {
                        this.addLoader = false
                        Swal.fire({
                            text: 'New Cutoff added successful',
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonColor: "#3290d6 !important",
                            confirmButtonText: 'Ok'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this._route.navigate(['apps/cutoffkcet/kcetcutofflist']);
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
        if (this.cutoffForm.status == "INVALID") {
            this.cutoffForm.markAllAsTouched();
            Swal.fire('', 'Please fill all mandatory data', 'error')
            return
        } else {
            this.addLoader = true
            let college_id = this.cutoffForm.value.collegeid
            let round = this.cutoffForm.value.rounded
            let course_id = this.cutoffForm.value.course
            let category_id = this.cutoffForm.value.contentcategory
            let oneG = this.cutoffForm.value.oneG
            let oneH = this.cutoffForm.value.oneH
            let oneK = this.cutoffForm.value.oneK
            let oneKH = this.cutoffForm.value.oneKH
            let oneR = this.cutoffForm.value.oneR
            let oneRH = this.cutoffForm.value.oneRH
            let twoAG = this.cutoffForm.value.twoAG
            let twoAH = this.cutoffForm.value.twoAH
            let twoAK = this.cutoffForm.value.twoAK
            let twoAKH = this.cutoffForm.value.twoAKH
            let twoAR = this.cutoffForm.value.twoAR
            let twoARH = this.cutoffForm.value.twoARH
            let twoBG = this.cutoffForm.value.twoBG
            let twoBH = this.cutoffForm.value.twoBH
            let twoBK = this.cutoffForm.value.twoBK
            let twoBKH = this.cutoffForm.value.twoBKH
            let twoBR = this.cutoffForm.value.twoBR
            let twoBRH = this.cutoffForm.value.twoBRH
            let treeAG = this.cutoffForm.value.treeAG
            let treeAH = this.cutoffForm.value.treeAH
            let treeAK = this.cutoffForm.value.treeAK
            let treeAKH = this.cutoffForm.value.treeAKH
            let treeAR = this.cutoffForm.value.treeAR
            let treeARH = this.cutoffForm.value.treeARH
            let treeBG = this.cutoffForm.value.treeBG
            let treeBH = this.cutoffForm.value.treeBH
            let treeBK = this.cutoffForm.value.treeBK
            let treeBKH = this.cutoffForm.value.treeBKH
            let treeBR = this.cutoffForm.value.treeBR
            let treeBRH = this.cutoffForm.value.treeBRH
            let GM = this.cutoffForm.value.GM
            let GMH = this.cutoffForm.value.GMH
            let GMK = this.cutoffForm.value.GMK
            let GMKH = this.cutoffForm.value.GMKH
            let GMR = this.cutoffForm.value.GMR
            let GMRH = this.cutoffForm.value.GMRH
            let SCG = this.cutoffForm.value.SCG
            let SCH = this.cutoffForm.value.SCH
            let SCK = this.cutoffForm.value.SCK
            let SCKH = this.cutoffForm.value.SCKH
            let SCR = this.cutoffForm.value.SCR
            let SCRH = this.cutoffForm.value.SCRH
            let STG = this.cutoffForm.value.STG
            let STH = this.cutoffForm.value.STH
            let STK = this.cutoffForm.value.STK
            let STKH = this.cutoffForm.value.STKH
            let STR = this.cutoffForm.value.STR
            let STRH = this.cutoffForm.value.STRH
            let year = this.cutoffForm.value.year
            this.campusService.insertKCETCutoff(college_id, round, course_id, category_id, year, oneG, oneH, oneK, oneKH, oneR, oneRH, twoAG, twoAH, twoAK, twoAKH, twoAR, twoARH,
                twoBG, twoBH, twoBK, twoBKH, twoBR, twoBRH, treeAG, treeAH, treeAK, treeAKH, treeAR, treeARH, treeBG, treeBH, treeBK, treeBKH, treeBR, treeBRH, GM, GMH, GMK, GMKH,
                GMR, GMRH, SCG, SCH, SCK, SCKH, SCR, SCRH, STG, STH, STK, STKH, STR, STRH).subscribe((res) => {
                    if (res.response_message == "Success") {
                        this.addLoader = false
                        Swal.fire({
                            text: 'Update Cutoff added successful',
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonColor: "#3290d6 !important",
                            confirmButtonText: 'Ok'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this._route.navigate(['apps/cutoffkcet/kcetcutofflist']);
                            }
                        });
                    } else {
                        this.addLoader = false
                        Swal.fire('', res.response_message, 'error');
                    }
                })
        }

    }


    getcollegeListData() {

        var college_id = this.cutoffForm.value.collegeid
        if (college_id == '') {

            var college_id = this.clgid;
        }
        this.campusService.getCollegeCategory(college_id).subscribe(
            (res) => {
                console.log(res);
                this.getCategoryListData = res.response_data;
                if (res.response_code == 200) {
                    this.subLoader1 = false;
                    this.subLoader2 = true;
                }
            },
            (error) => {
                console.error('Error:', error);
                // Handle error appropriately, e.g., show error message to user
            }
        );

        this.campusService.getDetailsById(this.cutoffid).subscribe((res) => {

            setTimeout(() => {
                if (this.getCategoryListData) {
                    let catname
                    this.getCategoryListData.forEach((item) => {

                        if (item.categoryid == this.retriveData.category_id) {

                            catname = item.categoryid;
                        }
                        this.catid = catname

                    });

                    this.cutoffForm.get('contentcategory').setValue(catname);

                }

            }, 2000);
        });

    }



    getDetailsById() {
        const routeParams = this._activatedroute.snapshot.params;
        this.cutoffid = routeParams.cutoff_id;

        this.campusService.getDetailsById(this.cutoffid).subscribe((res) => {
            if (res.response_message == "Success") {
             this.retriveData = res.response_data[0];

                this.cutoffForm.value.search = this.retriveData.collegename.replace(/\s+/g, ' ').trim();

                console.log('"'+this.cutoffForm.value.search+'"')
                this.getClgList();
                setTimeout(() => {
                    let collegeName;
                    if (this.collegeListData) {
                        console.log(this.collegeListData);
                        this.collegeListData.forEach((item) => {
                            if (item.id == this.retriveData.college_id) {
                                collegeName = item.id;
                            }
                        });
                        this.clgid = collegeName
                        this.cutoffForm.get('collegeid').setValue(collegeName);
                    }
                }, 2000);
            }
        },(error) => {
            console.error('Error:', error);
            // Handle error appropriately, e.g., show error message to user
        }
    );
    }


    getCollegeCourses() {
        var category_id = this.cutoffForm.value.contentcategory;
        var college_id = this.cutoffForm.value.collegeid;

        if (category_id == '') {
            var category_id = this.catid;
        }

        this.campusService.getCollegeCourses(college_id, category_id).subscribe((res) => {
            if (res.response_code === "400") {
                this.collegecourseListData = [];
                this.subLoader2 = false
            } else {
                this.collegecourseListData = res.response_data;
                this.subLoader2 = false
            }
        });
        this.campusService.getDetailsById(this.cutoffid).subscribe((res) => {
             this.retriveData = res.response_data[0];


             if (this.retriveData['1G'] != "" || this.retriveData['1H']!= "" || this.retriveData['1K']!="" || this.retriveData['1KH']!="" || this.retriveData['1R']!="" || this.retriveData['1RH'] !=""  ) {
                this.panelOpenState = true; // Open the panel
            } else {
                this.panelOpenState = false;
            }
            if (this.retriveData['2AG'] != "" || this.retriveData['2AH']!= "" || this.retriveData['2AK']!="" || this.retriveData['2AKH']!="" || this.retriveData['2AR']!="" || this.retriveData['2ARH'] !=""  ) {
                this.panelOpenState1 = true; // Open the panel
            } else {
                this.panelOpenState1 = false;
            }
            if (this.retriveData['2BG'] != "" || this.retriveData['2BH']!= "" || this.retriveData['2BK']!="" || this.retriveData['2BKH']!="" || this.retriveData['2BR']!="" || this.retriveData['2BRH'] !=""  ) {

                this.panelOpenState2 = true; // Open the panel
            } else {
                this.panelOpenState2 = false;
            }
            if (this.retriveData['3AG'] != "" || this.retriveData['3AH']!= "" || this.retriveData['3AK']!="" || this.retriveData['3AKH']!="" || this.retriveData['3AR']!="" || this.retriveData['3ARH'] !=""  ) {

                this.panelOpenState3 = true; // Open the panel
            } else {
                this.panelOpenState3 = false;
            }

            if (this.retriveData['3BG'] != "" || this.retriveData['3BH']!= "" || this.retriveData['3BK']!="" || this.retriveData['3BKH']!="" || this.retriveData['3BR']!="" || this.retriveData['3BRH'] !=""  ) {

                this.panelOpenState4 = true; // Open the panel
            } else {
                this.panelOpenState4 = false;
            }
            if (this.retriveData['GM'] != "" || this.retriveData['GMK']!= "" || this.retriveData['GMH']!="" || this.retriveData['GMKH']!="" || this.retriveData['GMR']!="" || this.retriveData['GMRH'] !=""  ) {

                this.panelOpenState5 = true; // Open the panel
            } else {
                this.panelOpenState5 = false;
            }
            if (this.retriveData['SCG'] != "" || this.retriveData['SCH']!= "" || this.retriveData['SCK']!="" || this.retriveData['SCKH']!="" || this.retriveData['SCR']!="" || this.retriveData['SCRH'] !=""  ) {

                this.panelOpenState6 = true; // Open the panel
            } else {
                this.panelOpenState6 = false;
            }
            if (this.retriveData['STG'] != "" || this.retriveData['STH']!= "" || this.retriveData['STKH']!="" || this.retriveData['STK']!="" || this.retriveData['STR']!="" || this.retriveData['STRH'] !=""  ) {

                this.panelOpenState7 = true; // Open the panel
            } else {
                this.panelOpenState7 = false;
            }

            this.cutoffForm.value.search = this.retriveData.collegename;
            this.cutoffForm.get('rounded').setValue(this.retriveData.round);
            this.cutoffForm.get('oneG').setValue(this.retriveData['1G']);
            this.cutoffForm.get('oneH').setValue(this.retriveData['1H']);
            this.cutoffForm.get('oneK').setValue(this.retriveData['1K']);
            this.cutoffForm.get('oneKH').setValue(this.retriveData['1KH']);
            this.cutoffForm.get('oneR').setValue(this.retriveData['1R']);
            this.cutoffForm.get('oneRH').setValue(this.retriveData['1RH']);
            this.cutoffForm.get('twoAG').setValue(this.retriveData['2AG']);
            this.cutoffForm.get('twoAH').setValue(this.retriveData['2AH']);
            this.cutoffForm.get('twoAK').setValue(this.retriveData['2AK']);
            this.cutoffForm.get('twoAKH').setValue(this.retriveData['2AKH']);
            this.cutoffForm.get('twoAR').setValue(this.retriveData['2AR']);
            this.cutoffForm.get('twoARH').setValue(this.retriveData['2ARH']);
            this.cutoffForm.get('twoBG').setValue(this.retriveData['2BG']);
            this.cutoffForm.get('twoBH').setValue(this.retriveData['2BH']);
            this.cutoffForm.get('twoBK').setValue(this.retriveData['2BK']);
            this.cutoffForm.get('twoBKH').setValue(this.retriveData['2BKH']);
            this.cutoffForm.get('twoBR').setValue(this.retriveData['2BR']);
            this.cutoffForm.get('twoBRH').setValue(this.retriveData['2BRH']);
            this.cutoffForm.get('treeAG').setValue(this.retriveData['3AG']);
            this.cutoffForm.get('treeAH').setValue(this.retriveData['3AH']);
            this.cutoffForm.get('treeAK').setValue(this.retriveData['3AK']);
            this.cutoffForm.get('treeAKH').setValue(this.retriveData['3AKH']);
            this.cutoffForm.get('treeAR').setValue(this.retriveData['3AR']);
            this.cutoffForm.get('treeARH').setValue(this.retriveData['3ARH']);
            this.cutoffForm.get('treeBG').setValue(this.retriveData['3BG']);
            this.cutoffForm.get('treeBH').setValue(this.retriveData['3BH']);
            this.cutoffForm.get('treeBK').setValue(this.retriveData['3BK']);
            this.cutoffForm.get('treeBKH').setValue(this.retriveData['3BKH']);
            this.cutoffForm.get('treeBR').setValue(this.retriveData['3BR']);
            this.cutoffForm.get('treeBRH').setValue(this.retriveData['3BRH']);
            this.cutoffForm.get('GM').setValue(this.retriveData['GM']);
            this.cutoffForm.get('GMK').setValue(this.retriveData['GMK']);
            this.cutoffForm.get('GMH').setValue(this.retriveData['GMH']);
            this.cutoffForm.get('GMKH').setValue(this.retriveData['GMKH']);
            this.cutoffForm.get('GMR').setValue(this.retriveData['GMR']);
            this.cutoffForm.get('GMRH').setValue(this.retriveData['GMRH']);
            this.cutoffForm.get('SCG').setValue(this.retriveData['SCG']);
            this.cutoffForm.get('SCH').setValue(this.retriveData['SCH']);
            this.cutoffForm.get('SCK').setValue(this.retriveData['SCK']);
            this.cutoffForm.get('SCKH').setValue(this.retriveData['SCKH']);
            this.cutoffForm.get('SCR').setValue(this.retriveData['SCR']);
            this.cutoffForm.get('SCRH').setValue(this.retriveData['SCRH']);
            this.cutoffForm.get('STG').setValue(this.retriveData['STG']);
            this.cutoffForm.get('STH').setValue(this.retriveData['STH']);
            this.cutoffForm.get('STKH').setValue(this.retriveData['STKH']);
            this.cutoffForm.get('STK').setValue(this.retriveData['STK']);
            this.cutoffForm.get('STR').setValue(this.retriveData['STR']);
            this.cutoffForm.get('STRH').setValue(this.retriveData['STRH']);

            // Wait for 2 seconds before processing college course list data
            setTimeout(() => {
                console.log("ssss" +JSON.stringify(this.collegecourseListData) );
                if (this.collegecourseListData) {
                    let coursename;
                    this.collegecourseListData.forEach((item) => {
                        console.log(item)
                        if (item.courseid == this.retriveData.course_id) {
                            coursename = item.courseid;
                        }
                    });
                    this.cutoffForm.get('course').setValue(coursename);

                }
            }, 2000);

            let year
            this.years.forEach((item) => {
                if (item == this.retriveData.year) {
                    year = item;
                }
            });
            this.cutoffForm.get('year').setValue(year)
        });
    }
    back() {
        this._route.navigate(['apps/cutoffkcet/kcetcutofflist']);
    }

}
