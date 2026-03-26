import { Component, OnInit,ViewChild ,TemplateRef, EventEmitter, Output, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormControl } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

interface Status {
  id: string;
  name: string;
}

interface College {
cityname:string;
id:string;
map_location:string;
registraion_type:string;
statename:string;
status:string;
title:string;
views:string;
}

interface QWE {
  title: string; id: string
}

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.scss'],
})



export class EventdetailsComponent implements OnInit {
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
  @Input() eventDetails: any;
  status: Status[] = [
    {id: '1', name: 'Active'},
    {id: '0', name: 'Inactive'},
  ];
  eventForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  cityLoader : boolean = false;
  stateLoader : boolean = false;
  Loader : boolean = false;
  countryListData: any;
  years: number[] = [];
  stateListData: any;
  retriveData: any;
  collegeTypslist: any;
  fromDateFrom3month = new Date();
  fromMinDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  minDate = new Date(new Date().setMonth(new Date().getMonth() + 2));
  fromMaxDate = new Date();
  frdate = new Date(new Date().setDate(new Date().getDate() + 7));
  
  eventMinDate = new Date(Date.now());
  eventMaxDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
  eventId:any
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 1;
  sortValue: string = "desc";
  columnIndex: number = 0;

  collegeListData: College[];
  startDate: Date;
  endDate: Date;

  
    constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ){}
   

    ngOnInit(): void {
      this.eventForm = this._formBuilder.group({
        event: ['',[Validators.required,Validators.minLength(3)]],
        address : ['',[Validators.required,Validators.minLength(3)]],
        mobileNumber:['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
        emailAddress:['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        website : ['',[Validators.required,Validators.minLength(3)]],
        maplocation : ['',[Validators.required,Validators.minLength(3)]],
        description : ['',[Validators.required,Validators.minLength(3)]],
        regPkgType : ['',Validators.required],
        fromdate : ['',Validators.required],
        todate : ['',Validators.required],
        collegeid : ['',Validators.required],
        status : ['',Validators.required],
        search : ['']
  })
  this.eventId = this.eventDetails.event_id
  if(this.eventId != null){
    this.updateButton = true
    this.Loader = true
    this.eventForm.value.search = this.eventDetails.collegename
  }

  this.getClgList()
}

searchValue(){
  this.getClgList()
}

checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

getClgList(){
  this.campusService.getClgList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.eventForm.value.search).subscribe((res) =>{
    this.collegeListData = res.data;
    this.getDetailsById()
  });
}


convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return ([ pad(d.getMonth()+1),pad(d.getDate()),d.getFullYear()].join('/'));
  
}



getDetailsById(){
  if(this.eventId != null){
    this.eventForm.get('event').setValue(this.eventDetails.event_name)
    this.eventForm.get('address').setValue(this.eventDetails.event_address)
    this.eventForm.get('mobileNumber').setValue(this.eventDetails.event_phone)
    this.eventForm.get('emailAddress').setValue(this.eventDetails.event_email)
    this.eventForm.get('website').setValue(this.eventDetails.event_website)
    this.eventForm.get('maplocation').setValue(this.eventDetails.event_maplocation)
    this.eventForm.get('description').setValue(this.eventDetails.event_desc)
    this.eventForm.get('fromdate').setValue(this.eventDetails.event_start_date)
    this.eventForm.get('todate').setValue(this.eventDetails.event_end_date)

      //status
      let Status
      this.status.forEach((status) => {
        if (status.id == this.eventDetails.event_status) {
          Status = status.id;
        }
      });
      this.eventForm.get('status').setValue(Status)

       //collegeId
       let collegeId
       this.collegeListData.forEach((item) => {
         if (item.id == this.eventDetails.event_college_name) {
          collegeId = item.id;
         }
       });
       this.eventForm.get('collegeid').setValue(collegeId)

       //packege type
       if(this.eventDetails?.event_package == "free_listing"){
        this.eventForm.get('regPkgType').setValue("free_listing")
      }else{
        this.eventForm.get('regPkgType').setValue("feature_listing")
      }
      this.Loader = false

  }
}


fromDateChange(event) {
 
  const selectedDate = new Date(event.value); // Get the selected date
   console.log(event.value)
  this.startDate = new Date(selectedDate.getTime() + (5.5 * 60 * 60 * 1000));
  
  
  const d = new Date(this.startDate);
  let month = d.getMonth();
  let today = new Date();
  this.fromDateFrom3month = new Date(new Date(d).setMonth(month + 3));
  var Difference_In_Time = today.getTime() - this.fromDateFrom3month.getTime();
  if (Difference_In_Time < 0)
    this.fromDateFrom3month = today;
}

fromDateChange2(event){
 const selectedDate = new Date(event.value);
 this.endDate = new Date(selectedDate.getTime() + (5.5 * 60 * 60 * 1000))
}


insertEventDetails(){
  if(this.eventForm.status == "INVALID"){
    this.eventForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.addLoader = true
  let name = this.eventForm.value.event.charAt(0).toUpperCase() + this.eventForm.value.event.slice(1)
  let address = this.eventForm.value.address
  let contactnumber = this.eventForm.value.mobileNumber
  let email = this.eventForm.value.emailAddress
  let website = this.eventForm.value.website
  let maplocation = this.eventForm.value.maplocation
  let start_date = this.startDate
  let end_date = this.endDate
  console.log(start_date)
  console.log(end_date)
  let desc = this.eventForm.value.description
  let collegeid = this.eventForm.value.collegeid
  let regPkgType = this.eventForm.value.regPkgType
  let status = this.eventForm.value.status

  console.log(this.eventForm.value)
  this.campusService.insertEventsDetails(name,address,contactnumber,email,website,maplocation,start_date,end_date,desc,collegeid,regPkgType,status).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.addLoader = false
      Swal.fire({
        text:  'Event details added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("postId",JSON.stringify(res.response_data.id));
      this.sendValueToParent()
        }
      });
    }else{
      this.addLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })
}
}

updateEventDetails(){
  if(this.eventForm.status == "INVALID"){
    this.eventForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.updateLoader = true
  let name = this.eventForm.value.event.charAt(0).toUpperCase() + this.eventForm.value.event.slice(1)
  let address = this.eventForm.value.address
  let contactnumber = this.eventForm.value.mobileNumber
  let email = this.eventForm.value.emailAddress
  let website = this.eventForm.value.website
  let maplocation = this.eventForm.value.maplocation
  let start_date = this.startDate
  let end_date = this.endDate
  console.log(start_date)
  console.log(end_date)
  let desc = this.eventForm.value.description
  let collegeid = this.eventForm.value.collegeid
  let regPkgType = this.eventForm.value.regPkgType
  let status = this.eventForm.value.status

  this.campusService.updateEventDetails(this.eventId,name,address,contactnumber,email,website,maplocation,start_date,end_date,desc,collegeid,regPkgType,status).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.updateLoader = false
      Swal.fire({
        text:  'Event details updated successful',
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
  this._route.navigate(['apps/event/viewevents']);
}

sendValueToParent() {
  const valueToSend = "1";
  this.valueChanged.emit(valueToSend);
}

}
