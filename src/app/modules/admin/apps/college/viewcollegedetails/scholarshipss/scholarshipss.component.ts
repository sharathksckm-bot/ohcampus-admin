import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-scholarshipss',
  templateUrl: './scholarshipss.component.html',
  styleUrls: ['./scholarshipss.component.scss']
})
export class ScholarshipssComponent implements OnInit {
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

  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  scholarshipForm : FormGroup;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  clgId: any;
  cityListData: any;
  Loader : boolean = false;
  scholarshipsList: any;
  selectedScholarships: any[] = [];
  scholarshipIds: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
      this.scholarshipForm = this._formBuilder.group({
      scholarship: [''],

})

  this.clgId = this.collegeDetails.id
  if ((this.clgId != null)) {
    this.updateButton = true
    this.Loader = true
    this.getScholarshipsDetails()
  }
  this.Loader = true
  setTimeout(() => {
      this.Loader = false
  }, 2000);
  }

  sendValueToParent() {
    const valueToSend = "11";
    this.valueChanged.emit(valueToSend);
  }

  getScholarshipsDetails(){
    if (this.clgId != null) {
     this.scholarshipForm.get('scholarship').setValue(this.collegeDetails.scholarship)
    this.Loader = false
  }
  }

  updateScholarshipDetails(){
    if(this.scholarshipForm.status == "INVALID"){
      this.scholarshipForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }
      this.updateLoader = true
      let scholarships = this.scholarshipForm.value.scholarship

     this.campusService.updateScholarshipsForClg(this.clgId,scholarships).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text:  'Scholarship updated successful',
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

  sendValueToParent2() {
    const valueToSend = "9";
    this.valueChanged.emit(valueToSend);
  }

}
