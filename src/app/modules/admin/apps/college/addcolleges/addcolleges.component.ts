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
  selector: 'app-addcolleges',
  templateUrl: './addcolleges.component.html',
  styleUrls: ['./addcolleges.component.scss'],

})
export class AddcollegesComponent implements OnInit {
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
  collegeForm : FormGroup;
  contactNum : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  cityLoader : boolean = false;
  stateLoader : boolean = false;
  Loader : boolean = false;
  clgId: any;
  isChecked: any;
  countryListData: any;
  years: number[] = [];
  stateListData: any;
  retriveData: any;
  collegeTypslist: any;
  cityListData: any;
  showAddButton : boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.collegeForm = this._formBuilder.group({
      collegeName: ['',[Validators.required]],
      country : ['',Validators.required],
      state : ['',Validators.required],
      city : ['',Validators.required],
      year : [''],
      address : ['',[Validators.required]],
      // mobileNumber:['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
      emailAddress:['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      accreditation : [''],
      website : ['',[Validators.required]],
      maplocation : ['',[Validators.required]],
      clgType : ['',Validators.required],
      description : ['',[Validators.required]],
      regPkgType : [''],
      status : ['',Validators.required],
      // conditions : ['',[Validators.minLength(3)]],
      menu : [0],
      entranceTest : [''],
      what_new :  [''],
      notificaton: [''],
      notificatonlink: [''],
      application_link:[''],
      is_trending:['']



      // notificatonlink: ['',Validators.pattern('^[a-zA-Z0-9._%+-]+\\.[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')],
})

this.contactNum = this._formBuilder.group({
  contactNumber: this._formBuilder.array([]),
});

this.addItem()
this.getCountryList()
this.generateYears()
this.getCollegeTypes()
}

contactNumber(): FormArray {
  return this.contactNum.get("contactNumber") as FormArray;
}

multiContacts(): FormGroup {
  return this._formBuilder.group({
    mobileNumber: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
  });
}

addItem(): void {
  this.contactNumber().push(this.multiContacts());
  this.showAddButton = false
}

addMember(){
  if(this.contactNum.status == "VALID"){
   this.showAddButton = true
  }else{
    this.showAddButton = false
  }
}

removeItem(contactNumber,contactIndex) {
  this.contactNumber().removeAt(contactIndex)
  this.showAddButton = true
}

generateYears(): void {
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= currentYear - 124; year--) {
    this.years.push(year);
  }
}

checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

updateTopMenuValue(event: any) {
  this.isChecked = event?.checked;
  this.collegeForm.get('menu').setValue(this.isChecked ? 1 : 0);
}

getCollegeTypes(){
  this.campusService.getCollegeType().subscribe((res) =>{
    this.collegeTypslist = res.response_data
  })
}

getCountryList(){
  this.campusService.getCountry().subscribe((res) =>{
    this.countryListData = res.response_data;
  });
}

getStateDetailsByCntId(){
   // alert(2222)
  let country = this.collegeForm.value.country
  this.stateLoader = true
  this.campusService.getStateDetailsByCntId(country).subscribe((res) =>{
    if(res.response_message == "Success"){
  this.stateListData = res.response_data;
  
  this.stateLoader = false
    }else{
      this.stateLoader = false
    }
  });

}

getCityDetailsByStateId(){
  let stateId = this.collegeForm.value.state
  this.cityLoader = true
  this.campusService.getCityDetailsByStateId(stateId).subscribe((res) =>{
  if(res.response_message == "Success"){
  this.cityListData = res.response_data;
  this.cityLoader = false
  }else{
    this.cityLoader = false
  }
   });

}

packageUpadte(value){
  if(this.collegeForm.value.regPkgType == 'free_listing'){
    this.collegeForm.get('notificaton').setValue('')
    this.collegeForm.get('notificatonlink').setValue('')
  }
}

insertClgDetails(){
  if(this.collegeForm.status == "INVALID"){
    this.collegeForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
  }

  if(this.contactNum.status == "INVALID"){
    this.contactNum.markAllAsTouched();
    Swal.fire('', 'Please enter contact number or delete', 'error')
    return
  }

  if(this.collegeForm.value.regPkgType == ""){
    Swal.fire('', 'Please select registration package type', 'error')
      return
  }

  if(this.collegeForm.value.entranceTest == ""){
    Swal.fire('', 'Please select entrance test to link predictor', 'error')
      return
  }

  if(this.collegeForm.value.is_trending == ""){
    Swal.fire('', 'Please select is trending', 'error')
      return
  }

  this.addLoader = true
  let collegeName = this.collegeForm.value.collegeName.charAt(0).toUpperCase() + this.collegeForm.value.collegeName.slice(1)
  let country = this.collegeForm.value.country
  let state = this.collegeForm.value.state
  let city = this.collegeForm.value.city
  let year = this.collegeForm.value.year
  let address = this.collegeForm.value.address
  let mobileNumber = this.contactNum.controls.contactNumber.value
  // let mobileNumber
  let emailAddress = this.collegeForm.value.emailAddress
  let accreditation = this.collegeForm.value.accreditation
  let website = this.collegeForm.value.website
  let maplocation = this.collegeForm.value.maplocation
  let clgType = this.collegeForm.value.clgType
  let description = this.collegeForm.value.description
  let regPkgType = this.collegeForm.value.regPkgType
  let status = this.collegeForm.value.status
  // let conditions = this.collegeForm.value.conditions
  let conditions = ''
  let menu = this.collegeForm.value.menu
  let entranceTest =  this.collegeForm.value.entranceTest
  let what_new =  this.collegeForm.value.what_new
  let notification =  this.collegeForm.value.notificaton
  let notification_link =  this.collegeForm.value.notificatonlink
   let application_link =  this.collegeForm.value.application_link
  let is_trending = this.collegeForm.value.is_trending


  this.campusService.insertCollegeDetails( collegeName,country,state,mobileNumber,accreditation,
    maplocation,city,year,address,emailAddress,website,clgType,description,regPkgType,
    conditions,status,menu,entranceTest,what_new,notification,notification_link,application_link,is_trending).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.addLoader = false
      Swal.fire({
        text:  'New college details added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/college/colleges']);
        }
      });
    }else{
      this.addLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })

}

back(){
  this._route.navigate(['apps/college/colleges']);
}

}

