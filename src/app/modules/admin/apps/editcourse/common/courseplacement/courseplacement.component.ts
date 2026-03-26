import { Component, OnInit,ViewChild ,TemplateRef, EventEmitter, Output, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courseplacement',
  templateUrl: './courseplacement.component.html',
  styleUrls: ['./courseplacement.component.scss']
})
export class CourseplacementComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() courseDetails: any;
  placementForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  cityLoader : boolean = false;
  stateLoader : boolean = false;
  Loader : boolean = false;
  courseId: any;
  clgId: any;
  placementData: any;

  constructor(
  private _formBuilder: FormBuilder,
  private campusService : CampusService,
  public globalService: GlobalService,
  public dialog: MatDialog,
  public _activatedroute: ActivatedRoute,
  public _route: Router, ) { }

ngOnInit(): void {
    this.placementForm = this._formBuilder.group({
      students: [''],
      salary : [''],
      compony:[''],
})

this.courseId = this.courseDetails.courseid
if(this.courseDetails.placement != '' && this.courseDetails.placement != null){
  this.placementData = this.courseDetails.placement
  this.updateButton = true
  this.Loader = true
  this.getDetailsById()
}
}

checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

getDetailsById(){
    this.placementForm.get('students').setValue(this.placementData.placed_student)
    this.placementForm.get('salary').setValue(this.placementData.salary)
    this.placementForm.get('compony').setValue(this.placementData.companies)
    this.Loader = false
}



updatePlacementDetails(){
  if(this.placementForm.status == "INVALID"){
    this.placementForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.updateLoader = true
  let fieldName = "PLACEMENT"
  let total_intake=""
    let median_salary=""
  this.clgId = this.courseDetails.collegeid
  let fieldDetails = {
    placed_student : this.placementForm.value.students,
    salary : this.placementForm.value.salary,
    companies : this.placementForm.value.compony
  }
  // let students = this.placementForm.value.students
  // let salary = this.placementForm.value.salary
  // let compony = this.placementForm.value.compony

  this.campusService.updateCourses(this.clgId,this.courseId,fieldName,fieldDetails).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.updateLoader = false
      Swal.fire({
        text:  'Course placement updated successful',
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
