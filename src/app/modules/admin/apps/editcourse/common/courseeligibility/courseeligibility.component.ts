import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-courseeligibility',
  templateUrl: './courseeligibility.component.html',
  styleUrls: ['./courseeligibility.component.scss']
})
export class CourseeligibilityComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() courseDetails: any;
  eligibilityForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  retriveData: any;
  UGCourseslist: any;
  PGCourseslist: any;
  selectedUGCourses: string[] = [];
  selectedPGCourses: any = [];
  courseId: any;
  showAddButton: boolean = false;
  highlightsIndex: any;

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
  clgId: any;
  eligibilityIndex: any;
  eligibilityData: any;
    constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.eligibilityForm = this._formBuilder.group({
        eligibility: this._formBuilder.array([]),
      });


      this.courseId = this.courseDetails.courseid
      this.clgId = this.courseDetails.collegeid
      this.addItem()

        this.eligibilityData = this.courseDetails.eligibility
        if(this.eligibilityData != '' && this.eligibilityData != null){
          this.Loader = true
          this.updateButton = true
          this.getDetailsById()
        }
    }

    getDetailsById(){
        this.courseDetails.eligibility.forEach((data,index) => {
          if(index!=0){
            this.addItem();
          }
          this.eligibility().controls[index].get('id').setValue(data.id) ;
          this.eligibility().controls[index].get('qualification').setValue(data.qualification) ;
          this.eligibility().controls[index].get('cut_off').setValue(data.cut_off) ;
          this.eligibility().controls[index].get('other_eligibility').setValue(data.other_eligibility) ;
        });
        this.Loader = false

    }

      eligibility(): FormArray {
        return this.eligibilityForm.get("eligibility") as FormArray;
      }

      multieligibility(): FormGroup {
        return this._formBuilder.group({
          id:'',
          qualification: ['', Validators.required],
          cut_off: ['', Validators.required],
          other_eligibility: [''],
        });
      }

      addItem(): void {
        this.eligibility().push(this.multieligibility());
        this.showAddButton = false
      }

      addMember(){
        if(this.eligibilityForm.status == "VALID"){
         this.showAddButton = true
        }
      }

      removeItem(eligibility,eligibilityIndex) {
        this.eligibilityIndex = eligibilityIndex;
        this.eligibility().removeAt(eligibilityIndex)
          this.showAddButton = true
      }

      updateEligibilityDetails(){
        if(this.eligibilityForm.status == "INVALID"){
          this.eligibilityForm.markAllAsTouched();
          Swal.fire('', 'Please fill all mandatory data', 'error')
            return
         }else{
        let fieldName = "ELIGIBILITY"
        let total_intake=""
        let median_salary=""

        this.updateLoader = true
        let fieldDetails = {
          eligibility : this.eligibilityForm.controls.eligibility.value
        }
        this.campusService.updateCourses(this.clgId,this.courseId,fieldName,fieldDetails).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.updateLoader = false
            Swal.fire({
              text: 'Course eligibility updated successful',
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
        const valueToSend = "2";
        this.valueChanged.emit(valueToSend);
      }
      sendValueToParent2() {
        const valueToSend = "0";
        this.valueChanged.emit(valueToSend);
      }

}
