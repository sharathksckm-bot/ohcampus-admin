import { Component, OnInit,ViewChild ,TemplateRef, EventEmitter, Output, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-coursehighlight',
  templateUrl: './coursehighlight.component.html',
  styleUrls: ['./coursehighlight.component.scss']
})
export class CoursehighlightComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() courseDetails: any;
  highlightForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  cityLoader : boolean = false;
  stateLoader : boolean = false;
  Loader : boolean = false;

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
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
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
  courseId: any;
  courses: any;
  clgId: any;

constructor(
  private _formBuilder: FormBuilder,
  private campusService : CampusService,
  public globalService: GlobalService,
  public dialog: MatDialog,
  public _activatedroute: ActivatedRoute,
  public _route: Router, ) { }

ngOnInit(): void {
    this.highlightForm = this._formBuilder.group({
      totalFees: [''],
      total_intake:[''],
      median_salary:[''],
      ranking: [''],
      duration : [''],
      level:[''],
      website : [''],
      slug : [''],
      description : [''],
})
this.getAcCategoryForCourse()
this.clgId = this.courseDetails.collegeid
this.courseId = this.courseDetails.courseid

if(this.courseId != null){
  this.updateButton = true
  this.Loader = true
}
}

checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

getAcCategoryForCourse(){
  this.campusService.getAcCategoryForCourse().subscribe((res) =>{
    this.courses = res.response_data
    this.getDetailsById()
  })
}

getDetailsById(){
  if(this.courseId != null){
    this.highlightForm.get('totalFees').setValue(this.courseDetails.total_fees)
    this.highlightForm.get('ranking').setValue(this.courseDetails.rank)
    this.highlightForm.get('duration').setValue(this.courseDetails.duration)
    this.highlightForm.get('website').setValue(this.courseDetails.website)
    this.highlightForm.get('slug').setValue(this.courseDetails.slug)
    this.highlightForm.get('description').setValue(this.courseDetails.description)
    this.highlightForm.get('total_intake').setValue(this.courseDetails.total_intake)
    this.highlightForm.get('median_salary').setValue(this.courseDetails.median_salary)

      //course
      let course
      this.courses.forEach((status) => {
        if (status.name == this.courseDetails.level) {
          course = status.name;
        }
      });
      this.highlightForm.get('level').setValue(course)

      this.Loader = false

  }
}



updateHighlightsDetails(){
  if(this.highlightForm.status == "INVALID"){
    this.highlightForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.updateLoader = true
  let fieldName = "HIGHLIGHT"


  //let median_salary=""
 // let total_intake=""
  let fieldDetails = {
    totalFees : this.highlightForm.value.totalFees,
    rank : this.highlightForm.value.ranking,
    duration : this.highlightForm.value.duration,
    level : this.highlightForm.value.level,
    website : this.highlightForm.value.website,
    slug : this.highlightForm.value.slug,
    description : this.highlightForm.value.description,
     median_salary : this.highlightForm.value.median_salary,
     total_intake : this.highlightForm.value.total_intake
  }
  this.campusService.updateCourses(this.clgId,this.courseId,fieldName,fieldDetails).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.updateLoader = false
      Swal.fire({
        text:  'Course highlight updated successful',
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
  const index = '3'
  const navigationExtras = {
    queryParams: { index: index}
  };

  this._route.navigate(['apps/college/editcollegedetails/update/'+ this.clgId ], navigationExtras);
}

sendValueToParent() {
  const valueToSend = "1";
  this.valueChanged.emit(valueToSend);
}

}
