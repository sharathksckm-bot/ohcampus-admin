import { Component, OnInit,ViewChild ,TemplateRef, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';


interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-addspecilisation',
  templateUrl: './addspecilisation.component.html',
  styleUrls: ['./addspecilisation.component.scss']
})
export class AddspecilisationComponent implements OnInit {
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

  status: Status[] = [
    {id: '1', name: 'Active'},
    {id: '0', name: 'Inactive'},
  ];

  specilisationtForm : FormGroup; 
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  speId: any;
  showAddButton : boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router ) { }

ngOnInit(): void {
    this.specilisationtForm = this._formBuilder.group({
      specialisation: ['',[Validators.required]],
      status : ['',Validators.required],
})


const routeParams = this._activatedroute.snapshot.params;
if (routeParams.speId) {
  this.updateButton = true
  this.speId = routeParams.speId
  this.Loader = true
  this.getSpecializationById()
}

}

checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

getCollegeTypes(){
  this.campusService.getCollegeType().subscribe((res) =>{
  })
}

getSpecializationById(){
  this.campusService.getSpecializationById(this.speId).subscribe((res) =>{
    if(res.response_message == "Success"){

     this.specilisationtForm.get('specialisation').setValue(res.response_data[0].name)
     this.specilisationtForm.get('status').setValue(res.response_data[0].status)
     this.Loader = false
    }
  })
}

insertSpecilisationDetails(){
  if(this.specilisationtForm.status == "INVALID"){
    this.specilisationtForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }

  this.addLoader = true
  let specialisation = this.specilisationtForm.value.specialisation.charAt(0).toUpperCase() + this.specilisationtForm.value.specialisation.slice(1)
  let status = this.specilisationtForm.value.status
  this.campusService.saveSpecialization(specialisation,status).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.addLoader = false
      Swal.fire({
        text:  'New specilization details added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/specilisation/specilisationlist']);
        } 
      });
    }else{
      this.addLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })

}

updateSpecilisationDetails(){
  if(this.specilisationtForm.status == "INVALID"){
    this.specilisationtForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }

  this.addLoader = true
  let specialisation = this.specilisationtForm.value.specialisation.charAt(0).toUpperCase() + this.specilisationtForm.value.specialisation.slice(1)
  let status = this.specilisationtForm.value.status
  this.campusService.updateSpecialization(specialisation,status,this.speId).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.addLoader = false
      Swal.fire({
        text:  'Specilization details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/specilisation/specilisationlist']);
        } 
      });
    }else{
      this.addLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })

}

back(){
  this._route.navigate(['apps/specilisation/specilisationlist']);
}

}
