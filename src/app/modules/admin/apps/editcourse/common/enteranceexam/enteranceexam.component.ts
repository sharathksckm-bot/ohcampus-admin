import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enteranceexam',
  templateUrl: './enteranceexam.component.html',
  styleUrls: ['./enteranceexam.component.scss']
})
export class EnteranceexamComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() courseDetails: any;
  entranceExamForm:FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  selectedItemsList: any;
  checkboxesDataList: any;
  checkedIDs: any[];
  examlist: any;
  selectedExams: any[] = [];
  courseId: any;
  examIds: string;
  clgId: any;
  examsIds: any;
  examNames: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.entranceExamForm = this._formBuilder.group({
      search_exam:'',
      exam : ''
    })
  this.courseId = this.courseDetails.courseid

  if(this.courseDetails.entrance_exams != '' && this.courseDetails.entrance_exams != null){
    this.examsIds = this.courseDetails.entrance_exams.split(',')
    this.examNames = this.courseDetails.examName.split(',')
    this.updateButton = true
    this.Loader = true
    this.bindExamsValue()
  }else{
    this.getExamList();
  }

  }

  bindExamsValue() {
    if (this.courseDetails.entrance_exams !== '' && this.courseDetails.entrance_exams !== null) {
      this.examNames.forEach((itemmm) => {
        let search_exam = itemmm;

        this.campusService.getExams(search_exam,'').subscribe((res) => {
          this.examlist = res.response_data;

          this.examsIds.forEach((item) => {
            this.examlist.forEach((itemm) => {
              if (item === itemm.exams_id) {
                this.selectedExams.push(itemm);
              }
            });
          });

          this.entranceExamForm.get('exam').setValue(this.selectedExams);
          this.changeSelection(this.entranceExamForm.value.exam);

          this.Loader = false;
        });
      });

    }
  }



  getExamList(){
    let search_exam = this.entranceExamForm.value.search_exam
    this.campusService.getExams(search_exam,'').subscribe((res) =>{
      this.examlist = res.response_data
    })
  }

  changeSelection(selectedexam) {
    this.selectedExams = selectedexam;

  }

  removeExam(index: number, id: any) {
    if (id != null) {
      this.selectedExams = this.selectedExams.filter(item => item.exams_id !== id);
      const examControl = this.entranceExamForm.get('exam');
      if (examControl) {
        examControl.setValue(this.selectedExams);
      }
    }
}

  updateExamDetails(){
    if(this.selectedExams.length == 0){
      Swal.fire('', 'Please select exams' , 'error')
      return
    }
    this.updateLoader = true
    this.examIds = "";
    this.selectedExams.forEach((item, index) => {
        const idAsNumber = Number(item.exams_id);
        this.examIds += idAsNumber;
        if (index < this.selectedExams.length - 1) {
            this.examIds += ",";
        }
    });
    let fieldName = "EXAMS"
    let total_intake= ""
    let median_salary=""
    this.clgId = this.courseDetails.collegeid
    let fieldDetails = {
      exams : this.examIds
    }
    this.campusService.updateCourses(this.clgId,this.courseId,fieldName,fieldDetails).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text: 'Course exams updated successful',
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

  sendValueToParent() {
    const valueToSend = "3";
    this.valueChanged.emit(valueToSend);
  }

  sendValueToParent2() {
    const valueToSend = "1";
    this.valueChanged.emit(valueToSend);
  }

}
