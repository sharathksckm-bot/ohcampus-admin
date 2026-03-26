import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray, FormControl } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { setValue } from '@ngneat/transloco';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-entranceexams',
    templateUrl: './entranceexams.component.html',
    styleUrls: ['./entranceexams.component.scss']
})
export class EntranceexamsComponent implements OnInit {
    @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
    @Input() collegeDetails: any;

    @Input() entranceExam: any;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    subcatlist: any;
    subcatExamForm: FormGroup;
    searchControl = new FormControl();
    searchControl1 = new FormControl();
    selectTakeExam: any[] = []; // List for exams to take
    selectUpadteTakeExam: any[] = []; // List for exams to take

    entranceExamDetails: any = [];
    ExamsArr: any = []
    filteredExams: any[] = [];
    isLoading: boolean = false;
    examForm: FormGroup;
    showLoader: boolean = false;
    addLoader: boolean = false;
    updateLoader: boolean = false;
    updateButton: boolean = false;
    Loader: boolean = false;
    clgId: any;
    isChecked: any;

    // selectExam = [];
    descriptionData: any;
    Ids: string;
    faqslist: any = [0];
    categoryList: any;
    faqsIds: any;
    showAddButton: boolean = false;
    faqsId: any;
    selectExam: any[''] = [];
    idData: any = [];
    arrayD = [];
    examlist: any;
    collegeid: null;
    searchControls: FormControl[] = [];


    exams: any;
    subcategoryname: any;
    staticData: any[] = [];
    retriveUserData: any;
    examIndex: number;
    subcat: number;
    ids: any;
    examindex: number;
    subcatid: any;
    tblLoader: boolean = true;
    editLoader: boolean = false;
    tmpfilteredExams: any;

    // private hasMethodRun = false;

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {


        if (this.subcatid != null) {
            this.searchControl.valueChanges.pipe(
                debounceTime(300)
            ).subscribe(searchTerm => {
                alert("call from searchControl 1")
                this.getExamsList(this.subcatid, searchTerm)
            });
        }
        this.searchControl1.valueChanges.pipe(
            debounceTime(300)
        ).subscribe(searchTerm => {

            this.getExamsList(this.subcatid, searchTerm)
        });

        this.clgId = this.collegeDetails.id;
        if ((this.clgId != null && this.subcat != null)) {
            this.updateButton = true
            // this.Loader = true
            this.entranceExamDetails = this.entranceExam
            this.getExamsList(this.subcatid, null)
        }


        this.examForm = this._formBuilder.group({
            subcat: [''],
            examids: ['']

        })

        this.subcatExamForm = this._formBuilder.group({
            subcat: [''],
            examids: ['']

        })
        this.getCollegeSubCat()
        this.getExamForSubCat()

    }


    // ngDoCheck(): void {
    //     if (!this.hasMethodRun) {
    //         console.log("getExamList called")
    //         this.getExamsList(this.subcatid, null)
    //       this.hasMethodRun = true;
    //     }
    //   }
    addExamdetails() {
        let subcat = this.examForm.value.subcat;
        let examids = this.examForm.value.examids;

        let examIdsString = examids.join(',');

        let examlist = [{
            subcat: subcat,
            examids: examIdsString
        }];

        console.log({
            collegeid: this.clgId,
            examlist: examlist
        });

        this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
            if (res.response_message === "Success") {
                this.updateLoader = false;
                Swal.fire({
                    text: 'Entrance Exam updated successfully',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: "#3290d6 !important",
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // this.sendValueToParent();
                        //  this.getCollegeSubCat()
                        this.getExamForSubCat()
                    }
                });
            } else {
                Swal.fire('', res.response_message, 'error');
            }
        });
        this.selectTakeExam = [];
        this.examForm.reset();
    }

    getCollegeSubCat() {
        let collegeid = this.collegeDetails.id
        this.campusService.getCollegeSubCat(collegeid).subscribe((res) => {
            this.subcatlist = res.response_data
            this.ids = this.subcatlist.map(item => item.id);
            console.log("IDs:", this.ids);
        })
    }






    onExamSelect(selectedExams: any[]) {
        this.selectTakeExam = [];
        selectedExams.forEach(examId => {
            const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
            if (selectedExam) {
                this.selectTakeExam.push(selectedExam);
            }
        });
    }



    onExamUpdateSelect(selectedExams: any[]) {

        this.selectUpadteTakeExam = [];
        selectedExams.forEach(examId => {
            const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
            if (selectedExam) {
                this.selectUpadteTakeExam.push(selectedExam);
            }
        });

    }
    removeTakeExam(index: number, examId: string) {
        this.selectTakeExam = this.selectTakeExam.filter(exam => exam.exams_id !== examId);
        const examIds = this.examForm.get('examids')?.value.filter(id => id !== examId);
        this.examForm.get('examids')?.setValue(examIds);
    }

    removeUpdateTakeExam(index: number, examId: string) {
        this.selectUpadteTakeExam = this.selectUpadteTakeExam.filter(exam => exam.exams_id !== examId);
        const examIds = this.subcatExamForm.get('examids')?.value.filter(id => id !== examId);
        this.subcatExamForm.get('examids')?.setValue(examIds);
    }


    updateExamDetails() {
        let subcat = this.subcatExamForm.value.subcat;
        let examids = this.subcatExamForm.value.examids;



        let examIdsString = examids.join(',');

        let examlist = [{
            subcat: subcat,
            examids: examIdsString
        }];

        console.log({
            collegeid: this.clgId,
            examlist: examlist
        });

        this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
            if (res.response_message === "Success") {
                this.updateLoader = false;
                Swal.fire({
                    text: 'Entrance Exam updated successfully',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: "#3290d6 !important",
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // this.sendValueToParent();
                        //  this.getCollegeSubCat()
                        this.getExamForSubCat()
                        this.close();
                    }
                });
            } else {
                Swal.fire('', res.response_message, 'error');
            }
        });
    }

    deleteItem(index: number) {
        //    alert("sdfa")
        let subcat = index;

        //    alert( "subcat id = "+subcat+" college id = "+this.clgId)

        let examlist = [{
            subcat: subcat,
            examids: ""
        }];

        console.log({
            collegeid: this.clgId,
            examlist: examlist
        });

        this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
            if (res.response_message === "Success") {
                this.updateLoader = false;
                Swal.fire({
                    text: 'Entrance Exam Deleted successfully',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: "#3290d6 !important",
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // this.sendValueToParent();
                        //  this.getCollegeSubCat()
                        this.getExamForSubCat()
                    }
                });
            } else {
                Swal.fire('', res.response_message, 'error');
            }
        });

    }

    searchExams() {
        const searchValue = this.searchControl.value.toLowerCase();

        this.filteredExams = this.tmpfilteredExams;
        this.filteredExams = this.filteredExams.filter((exam) =>
            exam.title.toLowerCase().includes(searchValue)
        )
    }
    getExamForSubCat() {
        const collegeid = this.collegeDetails.id;
        this.campusService.getExamForSubCat(collegeid).subscribe((res) => {
            let responseData = res.response_data;
            this.staticData = res.response_data;
            this.tblLoader = false;
        });
    }

    getExamsList(examIndex: number, searchTerm: string) {
        // alert(examIndex)



        this.examindex = examIndex;
        //  alert("lll"+ this.examindex)

        //  this.subcatid =this.examindex
        // this.collegeid = this.collegeDetails.id;
        //  this.getbyid(this.collegeid,this.subcatid);

        this.isLoading = true;
        // this.editLoader = true;
        const subcat = examIndex;
        this.subcat = examIndex
        this.campusService.getExams(searchTerm, subcat).subscribe((res) => {
            this.filteredExams = res.response_data;
            this.tmpfilteredExams = res.response_data;
            console.log("filtered Exam loaded")
            this.isLoading = false;
            // this.editLoader = false;
            // alert("df")
        });





        this.selectTakeExam = [];
    }



    //     editItem(categoryid: string) {
    //         const dialogRef = this.dialog.open(this.callAPIDialog);

    //         const collegeid = this.collegeDetails.id;
    //         const subcatid = categoryid;

    //         this.campusService.getExamForCollege(collegeid, subcatid).subscribe(
    //             (res) => {
    //                 if (res.response_message === "Success") {
    //                     this.retriveUserData = res.response_data[0];
    //                     console.log("Retrieved data:", this.retriveUserData);

    //                      this.subcatExamForm.get('subcat').setValue(this.retriveUserData.categoryid);

    // //if(this.retriveUserData.categoryid === this.ids ){
    //        const examIdsArray = this.retriveUserData.entrance_exams.split(',').map(id => id.trim());
    //         this.subcatExamForm.get('examids').setValue(examIdsArray);
    //         this.selectUpadteTakeExam = [];
    //           examIdsArray.forEach(examId => {
    //         const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
    //         if (selectedExam) {
    //             this.selectUpadteTakeExam.push(selectedExam);
    //         }
    //     });
    // //}







    //                 }
    //             }
    //         );
    //     }



    editItem(categoryid: string) {

        this.cdr.detectChanges()
        const dialogRef = this.dialog.open(this.callAPIDialog);
        //  localStorage.setItem('categoryid',categoryid);

        this.collegeid = this.collegeDetails.id;
        this.subcatid = categoryid;
        this.editLoader = true;
        this.getbyid(this.collegeid, this.subcatid)
    }


    getbyid(collegeid, subcatid) {

        this.editLoader = true;
        this.getExamsList(subcatid, null)

        this.campusService.getExamForCollege(collegeid, subcatid).subscribe(
            (res) => {
                if (res.response_message === "Success") {
                    this.retriveUserData = res.response_data[0];
                    console.log("Retrieved data:", this.retriveUserData);
                    this.editLoader = false;
                    //  getExamsList();
                    // alert("pppp"+subcatid );
                    // alert("ggg"+this.retriveUserData.categoryid);

                    //const subcatid = localStorage.getItem('categoryid');
                    // alert("sss"+subcatid)
                    // alert("aaaa"+this.retriveUserData.categoryid)
                    // alert("hhhh"+subcatid)
                    //  if(this.retriveUserData.categoryid===subcatid){
                    console.log(this.retriveUserData.categoryid)
                    this.subcatExamForm.get('subcat').setValue(this.retriveUserData.categoryid);

                    // Split and map the entrance exams
                    // this.examindex=  this.examindex;
                    // alert("nnn"+ this.examindex)
                    // alert("ddd"+this.retriveUserData.categoryid)
                    // if( this.examindex==this.retriveUserData.categoryid){
                    //       alert(1111)

                    // }
                    const examIdsArray = this.retriveUserData.entrance_exams.split(',').map(id => id.trim());
                    this.subcatExamForm.get('examids').setValue(examIdsArray);

                    // Clear any previously selected exams
                    this.selectUpadteTakeExam = [];

                    // Match selected exams to the filtered exams list
                    examIdsArray.forEach(examId => {
                        const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
                        if (selectedExam) {
                            this.selectUpadteTakeExam.push(selectedExam);

                        }
                    });
                }


                // Set the selected category ID in the form

            }
            // }
        );
    }



    close() {
        this.dialog.closeAll();
        this.subcatExamForm.reset();
        this.selectUpadteTakeExam = [];
        this.isLoading = false;
        this.filteredExams = [];
        this.searchControl1.reset();

    }

    back() {
        this.sendValueToParent2();
    }

    sendValueToParent() {
        const valueToSend = "5";
        this.valueChanged.emit(valueToSend);
    }



    sendValueToParent2() {
        const valueToSend = "3";
        this.valueChanged.emit(valueToSend);
    }





}