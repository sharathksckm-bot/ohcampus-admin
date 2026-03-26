import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-addcollegetype',
  templateUrl: './addcollegetype.component.html',
  styleUrls: ['./addcollegetype.component.scss']
})


export class AddcollegetypeComponent implements OnInit {

  status: Status[] = [
    {id: '1', name: 'Active'},
    {id: '0', name: 'Inactive'},
  ];

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  newCollegeType : FormGroup; 
  showLoader: boolean = false;
  updateButton : boolean = false;
  typeId: any;
  collegStatus: any;
  collegeIdData: any;
  collegeNameData: any;
  Loader : boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {

      this.newCollegeType = this._formBuilder.group({
          type: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
          status : ['',Validators.required]
       });

       const routeParams = this._activatedroute.snapshot.params;
       if (routeParams.typeId) {
        this.Loader = true
         this.typeId = routeParams.typeId;
       }
  }

  ngAfterViewInit(): void {
    if ((this.typeId != '' && this.typeId != undefined)) {
      setTimeout(() => { this.getClgTypeDetailsById(); }, 1000);
    }
  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getClgTypeDetailsById(){
    this.updateButton = true 
    this.campusService.getClgTypeDetailsById(this.typeId).subscribe((res) =>{
   if(res.response_message == "Success"){
    this.collegeIdData = res.response_data.id
    this.collegeNameData = res.response_data.name
    this.collegStatus = res.response_data.status
    this.Loader = false
    this.newCollegeType.get('type').setValue(this.collegeNameData)

    let catStatus
    this.status.forEach((status) => {
      if (status.id == this.collegStatus) {
        catStatus = status.id;
      }
    });
    this.newCollegeType.get('status').setValue(catStatus) 
   }
    });
  }

  insertClgTypeDetails(){
    if(this.newCollegeType.status == "INVALID"){
      this.newCollegeType.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.showLoader = true
    let status = this.newCollegeType.value.status
    let type = this.newCollegeType.value.type.charAt(0).toUpperCase() + this.newCollegeType.value.type.slice(1)
    this.campusService.insertClgTypeDetails(type , status).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.showLoader = false
        Swal.fire({
          text:  'New type added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/college/collegetype']);
          } 
        });
      }else{
        this.showLoader = false
        Swal.fire('', res.response_message , 'error')
      }
    })
  }
  }
  
  updatetClgTypeDetails(){
    if(this.newCollegeType.status == "INVALID"){
      this.newCollegeType.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.showLoader = true
    let status = this.newCollegeType.value.status
    let type = this.newCollegeType.value.type.charAt(0).toUpperCase() + this.newCollegeType.value.type.slice(1)
    this.campusService.updatetClgTypeDetails(type,status,this.collegeIdData).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.showLoader = false
        Swal.fire({
          text:  'College type updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/college/collegetype']);
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
    this._route.navigate(['apps/college/collegetype']);  }
  
}

