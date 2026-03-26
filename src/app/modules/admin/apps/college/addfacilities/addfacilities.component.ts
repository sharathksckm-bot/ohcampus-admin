import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
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
  selector: 'app-addfacilities',
  templateUrl: './addfacilities.component.html',
  styleUrls: ['./addfacilities.component.scss']
})
export class AddfacilitiesComponent implements OnInit {
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
  newFacilities : FormGroup; 
  Loader : boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  faciId: any;
  retriveUserData: any;
  iconList: string[] = ['people','person_add', 'domain','accessibility', 'account_balance', 'account_box', 'alarm', 'all_inclusive',
  'android', 'assignment', 'attach_file', 'backup', 'bookmark', 'build', 'business',
  'call', 'camera', 'check_circle', 'chrome_reader_mode', 'cloud', 'code', 'comment',
  'dashboard', 'delete', 'description', 'dns', 'done', 'drafts', 'email', 'error',
  'event', 'extension', 'face', 'favorite', 'filter', 'folder', 'forum', 'free_breakfast',
  'gesture', 'grade', 'group','group_add', 'help', 'highlight', 'home', 'https', 'info', 'input',
  'invert_colors', 'label', 'language', 'lightbulb', 'local_cafe', 'location_city',
  'mail', 'map', 'menu', 'mic', 'mood', 'nature', 'notifications','notifications_active','notifications_none',
  'notifications_off','notifications_paused', 'open_in_new','thumb_down_alt','thumb_up_alt',
  'pages', 'payment', 'person', 'phone', 'play_arrow', 'power', 'print', 'public',
  'query_builder', 'radio', 'receipt', 'restore', 'room', 'save', 'search', 'settings',
  'shopping_cart', 'star', 'supervisor_account', 'swap_horiz', 'thumbs_up_down',
  'timeline', 'today', 'touch_app', 'track_changes', 'update', 'verified_user',
  'visibility', 'watch_later', 'work', 'youtube_searched_for', 'zoom_out_map',

];

  constructor(
    
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,
  ) { }

  ngOnInit(): void {
    this.newFacilities = this._formBuilder.group({
      faciname:['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
      icon: ['',Validators.required],
      description: ['',Validators.required],
      status: ['',Validators.required],
    })

    const routeParams = this._activatedroute.snapshot.params;
if (routeParams.faciId) {
  this.Loader = true
  this.faciId = routeParams.faciId;
}
  }


ngAfterViewInit(): void {
  if ((this.faciId != '' && this.faciId != undefined)) {
    setTimeout(() => { this.getFacilitiesDetailsById(); }, 1000);
  }
}

checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

getFacilitiesDetailsById(){
  this.updateButton = true 
  let faciId = this.faciId 
  this.campusService.getFacilitiesDetailsById(faciId).subscribe((res) =>{
    if(res.response_message == "Success") { 
    this.retriveUserData = res.response_data

    this.newFacilities.get('faciname').setValue(this.retriveUserData?.title)
    this.newFacilities.get('description').setValue(this.retriveUserData?.description)

    let icon
    this.iconList.forEach((value) => {
      if (value == this.retriveUserData?.icon) {
        icon = value;
      }
    });
    this.newFacilities.get('icon').setValue(icon)

    let catStatus
    this.status.forEach((status) => {
      if (status.id == this.retriveUserData?.status) {
        catStatus = status.id;
      }
    });
    this.newFacilities.get('status').setValue(catStatus) 
    this.Loader = false
    }
  })
}

addFacilities(){
  if(this.newFacilities.status == "INVALID"){
    this.newFacilities.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.addLoader = true
  let faciname = this.newFacilities.value.faciname.charAt(0).toUpperCase() + this.newFacilities.value.faciname.slice(1)
  let icon = this.newFacilities.value.icon
  let description = this.newFacilities.value.description
  let status = this.newFacilities.value.status

  this.campusService.insertFacilities(faciname,description,icon,status).subscribe((res) =>{
    if(res.response_message == "Success") {                                
    this.addLoader = false  
    Swal.fire({
      text:  'New facility added successful',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: "#3290d6 !important",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this._route.navigate(['apps/college/facilities']);
      } 
    });
    }else{
      this.addLoader = false 
      Swal.fire('', res.response_message, 'error');
    }
  })
}
}

updateFacilities(){
  if(this.newFacilities.status == "INVALID"){
    this.newFacilities.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.addLoader = true
  let faciId = this.faciId
  let faciname = this.newFacilities.value.faciname.charAt(0).toUpperCase() + this.newFacilities.value.faciname.slice(1)
  let icon = this.newFacilities.value.icon
  let description = this.newFacilities.value.description
  let status = this.newFacilities.value.status

  this.campusService.updateFacilities(faciId,faciname,description,icon,status).subscribe((res) =>{
    if(res.response_message == "Success") {                                
    this.addLoader = false  
    Swal.fire({
      text:  'Facility updated successful',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: "#3290d6 !important",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this._route.navigate(['apps/college/facilities']);
      } 
    });
    }else{
      this.addLoader = false 
      Swal.fire('', res.response_message, 'error');
    }
  })
}
}

back(){
  this._route.navigate(['apps/college/facilities']);
}
}