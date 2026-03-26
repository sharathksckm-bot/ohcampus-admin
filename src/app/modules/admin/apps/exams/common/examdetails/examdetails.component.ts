import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { from } from 'rxjs';
import { isSafeInteger } from 'lodash';


interface Status {
  id: string;
  name: string;
}

interface Exam {
  id: string;
  name: string;
}


@Component({
  selector: 'app-examdetails',
  templateUrl: './examdetails.component.html',
  styleUrls: ['./examdetails.component.scss'],
})
export class ExamdetailsComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: '',
    uploadWithCredentials: true,

  };

  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() examDetails: any;
  status: Status[] = [
    { id: '1', name: 'Active' },
    { id: '0', name: 'Inactive' },
  ];



  examList: Exam[] = [
    { id: '1', name: 'State' },
    { id: '2', name: 'National' }
  ];

  selectedContent: any = [];
  examEditData: any = []
  examForm: FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader: boolean = false;
  updateButton: boolean = false;
  Loader: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  columnIndex: number = 0;
  startNum: number = 1;
  sortValue: string = "asc";
  search: string = "";
  retriveData: any;
  type: string = "college";
  examId: any;


  isChecked: any;
  categoryList: any[] = [];
  courseList: any[] = [];
  stateList: any[] = [];
  indexNum: number;
  postId: any = {};
  fromDateFrom3month = new Date();
  fromMinDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  minDate = new Date(new Date().setMonth(new Date().getMonth() + 2));
  fromMaxDate = new Date();
  frdate = new Date(new Date().setDate(new Date().getDate() + 7));
  eventMinDate = new Date(Date.now());
  eventMaxDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
  category: string;
  stateSelectedContent: any[] = [];
  states: string;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,) { }

  ngOnInit(): void {


    this.examForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      status: ['', Validators.required],
      courseLevel: ['', Validators.required],
      examLevel: ['', Validators.required],
      state: [''],
      menu: [0],
      description: ['', [Validators.required, Validators.minLength(3)]],
      criteria: ['', Validators.required],
      process: ['', Validators.required],
      pattern: ['', Validators.required],
      notification: ['', Validators.required],
      // notificationtitle : [''],
      fromdate: [''],
      todate: [''],
    })


    this.getCategoryList();
    this.getExamCourseList();

    // this.getExamStateList();

  }

  getExamStateList() {
    console.log(123)
    this.campusService.getExamStateList().subscribe((res) => {
      this.stateList = res.response_data;
      // console.log(this.stateList)
    })
  }
  getExamCourseList() {
    this.campusService.getExamCourseList().subscribe((res) => {
      this.courseList = res.response_data;
    })
  }


  changeExam(data) {
    console.log(data)
    if (data == 1) {

      this.getExamStateList();
    }

      let stateControl = this.examForm.get('state');
      if(data === '1'){
        stateControl.setValidators([Validators.required])
      }else{
        stateControl.clearValidators();
        stateControl.setValue('');
      }
      stateControl.updateValueAndValidity();
  }


  getCategoryList() {
    this.campusService.getCategoryListByType(this.type).subscribe((res) => {
      if (res.response_message == "Success") {

        this.categoryList = res.response_data
        console.log(this.categoryList);
        if (this.examDetails.exams_id != null) {
          this.getExamDetailsById();
        }

      }
    })
  }
  changeSelection(selected, type) {
    // console.log(type)
    if (type == "category") {
      this.selectedContent = selected;
    }

    if (type == "state") {
      this.stateSelectedContent = selected;
    }
    // console.log( this.selectedContent);
  }

  fromDateChange(event) {
    const d = new Date(this.examForm.value.Fromdate);
    console.log(this.examForm.value.Fromdate)
    let month = d.getMonth();
    let today = new Date();
    // console.log(today)
    this.fromDateFrom3month = new Date(new Date(d).setMonth(month + 3));
    var Difference_In_Time = today.getTime() - this.fromDateFrom3month.getTime();
    if (Difference_In_Time < 0)
      this.fromDateFrom3month = today;
  }


  updateTopMenuValue(event: any) {
    this.isChecked = event.checked;
    this.examForm.get('menu').setValue(this.isChecked ? 1 : 0);
  }

  removeCategory(index: number, id: any, type) {
    console.log(type)
    if (id != null) {
      if (type === 'category') {
        console.log(456)
        this.selectedContent = this.selectedContent.filter(item => item.id !== id);
        const contentControl = this.examForm.get('category');
        if (contentControl) {
          contentControl.setValue(this.selectedContent);
        }
      }

      if (type === 'state') {
        console.log(123)
        this.stateSelectedContent = this.stateSelectedContent.filter(item => item.id !== id);

        const contentControl = this.examForm.get('state');
        if (contentControl) {
          contentControl.setValue(this.stateSelectedContent);
        }
      }
    }

  }

  bindValue(type) {

    if (type == 'category') {
      console.log(this.examDetails)
      let categoryString = this.examDetails.category_names;
      let category = categoryString.split(',');

        // console.log(this.examDetails.category_names)
      if (this.categoryList !== undefined) {
        category.forEach((item) => {
          this.categoryList.forEach((itemm) => {
            if (item === itemm.catname) {
              this.selectedContent.push(itemm);
            }
          });
        });
        this.examForm.get('category').setValue(this.selectedContent);
        console.log(this.selectedContent)
        this.changeSelection(this.examForm.value.category, type);
      }
    }
    if (type == 'state') {
      let stateString = this.examDetails.state_names;
      console.log(stateString);

      let state = stateString.split(',');
      //  console.log(this.stateList)
      if (this.stateList !== undefined) {
        state.forEach((item) => {
          this.stateList.forEach((itemm) => {
            if (item === itemm.statename) {
              this.stateSelectedContent.push(itemm)
            }
          })
        })
      //  console.log(this.stateSelectedContent)
        this.examForm.get('state').setValue(this.stateSelectedContent)
        // console.log(this.examForm.value.state)
        this.changeSelection(this.examForm.value.state, type);

      }
      // console.log(this.examForm.value.state)

    }

    // console.log(this.examForm.value.category);
  }

  getExamDetailsById() {
    if (this.examDetails.status == 1 || '0') {
      this.updateButton = true
      this.examId = this.examDetails.exams_id

      //college name

      // alert(JSON.stringify(this.examDetails))
      this.examForm.get('name').setValue(this.examDetails.title)
      this.examForm.get('criteria').setValue(this.examDetails.criteria)
      this.examForm.get('process').setValue(this.examDetails.process)
      this.examForm.get('pattern').setValue(this.examDetails.pattern)
      this.examForm.get('notification').setValue(this.examDetails.notification)
      this.examForm.get('description').setValue(this.examDetails.description)
      this.examForm.get('courseLevel').setValue(this.examDetails.course_level)
      this.examForm.get("examLevel").setValue(this.examDetails.exam_level);

      if (this.examForm.value.examLevel == "1") {
        this.getExamStateList()
        setTimeout(()=>{
          this.bindValue('state');
        },700)

      }
      // this.examForm.get("state").setValue(this.examDetails.state_name);
      this.examForm.get("fromdate").setValue(this.examDetails.start_date);
      this.examForm.get("todate").setValue(this.examDetails.end_date);
      // console.log(this.examForm.value.state);
      this.bindValue('category')

      //status
      let Status
      this.status.forEach((status) => {
        if (status.id == this.examDetails.status) {
          Status = status.id;
        }
      });
      this.examForm.get('status').setValue(Status)

      if (this.examDetails.view_in_menu == 1) {
        this.examForm.get('menu').setValue(1)
      } else {
        this.examForm.get('menu').setValue(0)
      }
    }

    this.Loader = false;

  }

  insertExamDetails() {
    if (this.examForm.status == "INVALID") {
      this.examForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {
      this.addLoader = true
      let name = this.examForm.value.name.charAt(0).toUpperCase() + this.examForm.value.name.slice(1)
      // let category = this.examForm.value.category
      let description = this.examForm.value.description
      let status = this.examForm.value.status
      let menu = this.examForm.value.menu
      let criteria = this.examForm.value.criteria
      let process = this.examForm.value.process
      let pattern = this.examForm.value.pattern
      let notification = this.examForm.value.notification
      let courseLevel = this.examForm.value.courseLevel
      let examLevel = this.examForm.value.examLevel
      let state = this.examForm.value.state
      let fromDate = this.examForm.value.fromdate;
      let toDate = this.examForm.value.todate;


      this.category = "";
      this.selectedContent.forEach((item, index) => {
        //console.log(item)
        const idAsNumber = Number(item.id);
        this.category += idAsNumber;
        if (index < this.selectedContent.length - 1) {
          this.category += ",";
        }
      });

      this.states = "";
      this.stateSelectedContent.forEach((item, index) => {
        const idAsNumber = Number(item.id);
        this.states += idAsNumber;
        if (index < this.stateSelectedContent.length - 1) {
          this.states += ",";
        }
      })

      this.campusService.insertExamDetails(name, this.category, status, courseLevel, examLevel, this.states, fromDate, toDate, menu, description, criteria, process, pattern, notification).subscribe((res) => {
        if (res.response_message == "Success") {
          this.addLoader = false
          Swal.fire({
            text: 'New exam details added successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem("postId", JSON.stringify(res.response_data.id));
              this.sendValueToParent()
            }
          });
        } else {
          this.addLoader = false
          Swal.fire('', res.response_message, 'error')
        }
      })
    }
  }

  updateExamDetails() {
    if (this.examForm.status == "INVALID") {
      this.examForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {
      this.updateLoader = true

      let name = this.examForm.value.name.charAt(0).toUpperCase() + this.examForm.value.name.slice(1)
      // let category = this.examForm.value.category
      let description = this.examForm.value.description
      let status = this.examForm.value.status
      let menu = this.examForm.value.menu
      let criteria = this.examForm.value.criteria
      let process = this.examForm.value.process
      let pattern = this.examForm.value.pattern
      let notification = this.examForm.value.notification
      let course = this.examForm.value.courseLevel
      let examLevel = this.examForm.value.examLevel
      let state = this.examForm.value.state
      let fromDate = this.examForm.value.fromdate;
      let toDate = this.examForm.value.todate;

      console.log(fromDate + "    " + toDate)
      this.category = "";
      this.selectedContent.forEach((item, index) => {
        console.log(item)
        const idAsNumber = Number(item.id);
        this.category += idAsNumber;
        if (index < this.selectedContent.length - 1) {
          this.category += ",";
        }
      });
      
      this.states = "";
      this.stateSelectedContent.forEach((item, index) => {
        const idAsNumber = Number(item.id);
        this.states += idAsNumber;
        if (index < this.stateSelectedContent.length - 1) {
          this.states += ",";
        }
      })
      console.log(this.states)
      this.campusService.updateExamDetails(this.examId, name, this.category, status, course, examLevel, this.states, fromDate, toDate, menu, description, criteria, process, pattern, notification).subscribe((res) => {
        if (res.response_message == "Success") {
          this.updateLoader = false
          Swal.fire({
            text: 'Exam details updated successful',
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
          this.updateLoader = false
          Swal.fire('', res.response_message, 'error')
        }
      })
    }
  }

  back() {
    this._route.navigate(['apps/exams/examlist']);
  }

  sendValueToParent() {
    const valueToSend = "1";
    this.valueChanged.emit(valueToSend);
  }
}
