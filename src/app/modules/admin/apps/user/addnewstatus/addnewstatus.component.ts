import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addnewstatus',
  templateUrl: './addnewstatus.component.html',
  styleUrls: ['./addnewstatus.component.scss']
})
export class AddnewstatusComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  newUserStatus : FormGroup; 
  showLoader: boolean = false;
  updateType : boolean = false;
  userStatusData: any;
  userIdData: any;
  userNameData: any;
  statusId: any;
  Loader : boolean = false;
 

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {

  this.newUserStatus = this._formBuilder.group({
      status: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
         
   });
   const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.statusId) {
    this.Loader = true
    this.statusId = routeParams.statusId;
  }
  }

  ngAfterViewInit(): void {
    if ((this.statusId != '' && this.statusId != undefined)) {
      setTimeout(() => { this.getUserStatusById(); }, 1000);
    }
  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getUserStatusById(){
    this.updateType = true 
    this.campusService.getUserStatusById(this.statusId).subscribe((res) =>{
   if(res.response_message == "Success"){
    this.userIdData = res.response_data.id
    this.userNameData = res.response_data.name
    this.newUserStatus.get('status').setValue(this.userNameData)
    this.Loader = false
   }
    });
  }


  insertUserStatus(){
    if(this.newUserStatus.status == "INVALID"){
      this.newUserStatus.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
  
    this.showLoader = true
    let status = this.newUserStatus.value.status.charAt(0).toUpperCase() + this.newUserStatus.value.status.slice(1)
    this.campusService.insertUserStatus(status).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.showLoader = false
        this.userStatusData = res.response_data
        Swal.fire({
          text:  'New status added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/user/userstatus']);
          } 
        });
      }else{
        this.showLoader = false
        Swal.fire('', res.response_message , 'error')
      }
    })
  }
  }
  
  updateStatusList(){
    if(this.newUserStatus.status == "INVALID"){
      this.newUserStatus.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.showLoader = true
    let status = this.newUserStatus.value.status.charAt(0).toUpperCase() + this.newUserStatus.value.status.slice(1)
    this.campusService.updateUserStatus(status,this.statusId).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.showLoader = false
        Swal.fire({
          text:  'User status updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/user/userstatus']);
          } 
        });
      }else{
        this.showLoader = false
        Swal.fire('', res.response_message , 'error')
      }
    })
  }
  }

  back(){
    this._route.navigate(['apps/user/userstatus']);
  }
}
