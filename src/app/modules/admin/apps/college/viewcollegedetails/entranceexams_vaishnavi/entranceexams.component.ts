
import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
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

    searchControl = new FormControl();
    entranceExamDetails: any = [];
    ExamsArr: any = []
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
    filteredExams: any = [];
    arrayD = [];
    subcatlist: any;
    examlist: any;
    collegeid: null;

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router,) { }

    ngOnInit(): void {
        this.examForm = this._formBuilder.group({
            examArrayData: this._formBuilder.array([]),
        });
        this.changeSelection
        this.addItem();
        this.getCollegeSubCat();
        this.getExamList(0);
        this.clgId = this.collegeDetails.id
        if ((this.clgId != null)) {
            this.updateButton = true
            // this.Loader = true
            this.entranceExamDetails = this.entranceExam
        }

        this.searchControl.valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                this.filteredExams = this.filterExams(value);
            });
    }

    filterExams(searchTerm: string): any[] {
        if (!searchTerm) {
            return this.examlist;
        }
        return this.examlist.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    filteredExamList() {
        return this.filteredExams;
    }

    examArrayData(): FormArray {
        return this.examForm.get("examArrayData") as FormArray;
    }
    multipleFaqsData(): FormGroup {
        return this._formBuilder.group({
            id: '',
            examids: '',
            subcat: '',
            search_exam: ''

        });
    }
    addItem(): void {
        this.examArrayData().push(this.multipleFaqsData());
        this.showAddButton = false
    }


    getCollegeSubCat() {
        let collegeid = this.collegeDetails.id
        this.campusService.getCollegeSubCat(collegeid).subscribe((res) => {
            this.subcatlist = res.response_data

            this.entranceExamDetails.forEach((item, index) => {
                if (index != 0) {
                    this.addItem();
                }
                this.examArrayData().controls[index].get('id').setValue(item.id);
                let subcat
                this.subcatlist.forEach((itemm) => {
                    console.log(itemm)
                    console.log(item)
                    if (itemm.name == item.name) {
                        subcat = item.id
                    }
                })
                this.examArrayData().controls[index].get('subcat').setValue(subcat);
                console.log(subcat)
                this.idData[index] = item.entrance_exams
            });

        })
    }


    getExamList(examIndex) {
        let search_exam = this.examArrayData().controls[examIndex].get('search_exam').value;
        if (search_exam != "") {
            setTimeout(() => {
                this.campusService.getExams(search_exam, this.examArrayData().controls[examIndex].get('subcat').value).subscribe((res) => {
                    this.examlist = res.response_data;
                    console.log(this.examlist)
                    console.log("aaaa"+JSON.stringify(this.examlist))
                    this.filteredExams.next(this.examlist.slice());
                    this.entranceExamDetails.forEach((item, index) => {
                        let examIds = item.entrance_exams.split(',');
                        if (search_exam == "") {
                            let selectedExams = [];
                            examIds.forEach((itemm) => {
                                let matchingExam = this.examlist.find(examItem => examItem.exams_id === itemm);
                                if (matchingExam) {

                                    selectedExams.push(matchingExam);
                                    // alert("1111"+JSON.stringify(matchingExam))
                                }

                            });

                            const exams = this.examArrayData().at(examIndex).get('examids');

                            if (exams) {
                                exams.setValue(this.selectExam[examIndex]);

                            }
                            console.log(selectedExams)
                            this.examArrayData().controls[index].get('examids').setValue(selectedExams);
                        }
                    });

                });

            }, 1000);
        } else {
            setTimeout(() => {
                this.campusService.getExams(search_exam, this.examArrayData().controls[examIndex].get('subcat').value).subscribe((res) => {
                    console.log(this.examArrayData().controls[examIndex].get('subcat').value)
                    this.examlist = res.response_data;
                    // console.log(this.examlist)
                    // console.log(this.entranceExamDetails)
                    this.entranceExamDetails.forEach((item, index) => {
                        let examIds = item.entrance_exams.split(',');

                        let selectedExams = [];

                        examIds.forEach((itemm) => {
                            let matchingExam = this.examlist.find(examItem => examItem.exams_id === itemm);
                            if (matchingExam) {
                                selectedExams.push(matchingExam);
                                //  alert("22222"+JSON.stringify(matchingExam))

                            }

                        });

                        this.selectExam[index] = selectedExams;



                        const exams = this.examArrayData().at(examIndex).get('examids');

                        if (exams) {
                            exams.setValue(this.selectExam[examIndex]);
                        }
                        console.log(selectedExams)

                        this.examArrayData().controls[index].get('examids').setValue(selectedExams);

                    });
                });


            }, 1000);
        }
        // this.Loader = true

        // setTimeout(() => {
        //     this.Loader = false
        // }, 2000);
    }

    // addMember(examIndex) {
    //     this.showAddButton = true
    //     let subcat = this.examArrayData().controls[examIndex].get('subcat').value

    //     let examids = this.examArrayData().controls[examIndex].get('examids').value
    //     if (subcat != '' && examids != '') {
    //         this.showAddButton = false
    //     } else {
    //         this.showAddButton = true
    //     }
    // }

    addMember() {
        if (this.examForm.status == "VALID") {
            this.showAddButton = true
        }
    }

    removeItem(index: number, id: any, examIndex: number) {

        this.selectExam[examIndex] = this.selectExam[examIndex].filter(item => item.exams_id !== id);

        const exams = this.examArrayData().at(examIndex).get('examids');
        if (exams) {
            exams.setValue(this.selectExam[examIndex]);
        }
    }



    changeSelection(selectedCoursesx: any[], examIndex: number) {
        this.selectExam[examIndex] = selectedCoursesx;
    }

    updateExamdetails() {
        this.updateLoader = true;
        let uniqueExamIdsDict: { [subcat: string]: Set<string> } = {};

        this.selectExam.forEach((selectedExams, index) => {
            const examData = this.examArrayData().at(index);
            if (examData && examData.get('subcat')) {
                const subcat = examData.get('subcat').value;
                if (!uniqueExamIdsDict[subcat]) {
                    uniqueExamIdsDict[subcat] = new Set<string>();
                }
                selectedExams.forEach(exam => uniqueExamIdsDict[subcat].add(exam.exams_id));
            }
        });

        let examlist = Object.keys(uniqueExamIdsDict).map(subcat => {
            const examids = Array.from(uniqueExamIdsDict[subcat]).join(',');
            return { subcat, examids };
        });
        this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
            if (res.response_message == "Success") {
                this.updateLoader = false
                Swal.fire({
                    text: 'Entrance Exam updated successful',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: "#3290d6 !important",
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.sendValueToParent()
                    }
                });
            } else {
                Swal.fire('', res.response_message, 'error')
            }

        })
    }

    removearrayform(entrancedata, examIndex) {

        let examlist = []; // Initialize examlist as an empty array
        let subcat = entrancedata.value.subcat; // Assuming subcat is a string containing comma-separated values

        // Check if subcat is not empty
        if (subcat) {
            let subcatArray = subcat.split(',');

            // Assuming you have categoryId available, replace 'categoryIdValue' with your actual categoryId
            let categoryIdValue = 'categoryIdValue'; // Replace 'categoryIdValue' with the actual categoryId

            // Create an object with categoryId and subcat, and push it to examlist for each subcat
            subcatArray.forEach(subcatValue => {
                examlist.push({ subcat: subcatValue, examids: "" });
            });
        }
        Swal.fire({
            text: 'Are you really want to delete this entrance exam ? This can`t be undone.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
                    if (res.response_message == "Success") {
                        this.examArrayData().removeAt(examIndex);
                        if (this.selectExam[examIndex]) {
                            this.selectExam[examIndex].length = 0;
                        }
                        Swal.fire('', 'Your Exams has been deleted successfully !', 'success')

                    }
                    else {
                        Swal.fire('', 'Something went wrong.Please try again.', 'error')
                    }
                })
            }
        });

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


