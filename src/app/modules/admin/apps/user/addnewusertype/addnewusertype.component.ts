import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addnewusertype',
  templateUrl: './addnewusertype.component.html',
  styleUrls: ['./addnewusertype.component.scss']
})
export class AddnewusertypeComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  newUserType : FormGroup; 
  showLoader: boolean = false;
  updateType : boolean = false;
  userTypeData: any;
  typeId: any;
  userIdData: any;
  userNameData: any;
  Loader : boolean = false;
 

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {

  this.newUserType = this._formBuilder.group({
      type: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
         
   });
   
   const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.typeId) {
    this.Loader = true
    this.typeId = routeParams.typeId;
  }
  }

  ngAfterViewInit(): void {
      if ((this.typeId != '' && this.typeId != undefined)) {
        setTimeout(() => { this.getUserTypeById(); }, 1000);
      }
    }
    
  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getUserTypeById(){
    this.updateType = true 
    this.campusService.getUserTypeById(this.typeId).subscribe((res) =>{
   if(res.response_message == "Success"){
    this.userIdData = res.response_data.id
    this.userNameData = res.response_data.name
    this.newUserType.get('type').setValue(this.userNameData)
    this.Loader = false
   }
    });
  }

  insertTypeList(){
    if(this.newUserType.status == "INVALID"){
      this.newUserType.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.showLoader = true
    let type = this.newUserType.value.type.charAt(0).toUpperCase() + this.newUserType.value.type.slice(1)
    this.campusService.insertTypeList(type).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.showLoader = false
        this.userTypeData = res.response_data
        Swal.fire({
          text:  'New type added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/user/usertype']);
          } 
        });
      }else{
        this.showLoader = false
        Swal.fire('', res.response_message , 'error')
      }
    })
  }
  }

  updateTypeList(){
    if(this.newUserType.status == "INVALID"){
      this.newUserType.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.showLoader = true
    let type = this.newUserType.value.type.charAt(0).toUpperCase() + this.newUserType.value.type.slice(1)
    this.campusService.updateUserType(type,this.typeId).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.showLoader = false
        Swal.fire({
          text:  'User type updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/user/usertype']);
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
    this._route.navigate(['apps/user/usertype']);
  }

}
