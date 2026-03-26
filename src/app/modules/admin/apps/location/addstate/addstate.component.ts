import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addstate',
  templateUrl: './addstate.component.html',
  styleUrls: ['./addstate.component.scss']
})
export class AddstateComponent implements OnInit {
  stateForm : FormGroup; 
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  stateId: any;
  retriveUserData: any;
  countryListData: any;
  page: number = 1;
  pageSize: number = 10;
  columnIndex: number = 1;
  startNum: number = 1;
  sortValue: string = "asc";
  search: string = "";
  isChecked: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.stateForm = this._formBuilder.group({
        state: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),]],
        country: ['',Validators.required],
        menu: [0,Validators.required]
      })
  
    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.stateId) {
      this.Loader = true
      this.stateId = routeParams.stateId;
    }

    this.getCountryList()
  }

  updateTopMenuValue(event: any) {
    this.isChecked = event?.checked;
    this.stateForm.get('menu').setValue(this.isChecked ? 1 : 0);
  }
  
  ngAfterViewInit(): void {
    if ((this.stateId != '' && this.stateId != undefined)) {
      setTimeout(() => { this.getStateDetailsById(); }, 1000);
    }
  }

  getCountryList(){
    this.campusService.getCountryList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
      this.countryListData = res.data;
    });
  }

  getStateDetailsById(){
    this.updateButton = true  
    this.campusService.getStateDetailsById(this.stateId).subscribe((res) =>{
      if(res.response_message == "Success") { 
      this.retriveUserData = res.response_data

    let country
    this.countryListData.forEach((item) => {
      if (item.id == this.retriveUserData?.countryid) {
        country = item.id;
      }
    });
    this.stateForm.get('country').setValue(country)
      
    this.stateForm.get('state').setValue(this.retriveUserData?.statename)

    if(this.retriveUserData?.view_in_menu == 1){
      this.stateForm.get('menu').setValue(1)
    }else{
      this.stateForm.get('menu').setValue(0)
    }
    
      this.Loader = false
      }
    })
  }

  insertStateDetails(){
    if(this.stateForm.status == "INVALID"){
      this.stateForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
  
    this.addLoader = true
    let countryId = this.stateForm.value.country
    let stateName = this.stateForm.value.state.charAt(0).toUpperCase() + this.stateForm.value.state.slice(1)
    let view_in_menu =  this.stateForm.value.menu
    this.campusService.insertStateDetails(stateName,countryId,view_in_menu).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.addLoader = false  
      Swal.fire({
        text:  'New state added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/location/state']);
        } 
      });
      }else{
        this.addLoader = false 
        Swal.fire('', res.response_message, 'error');
      }
    })
  }
  }

  updateStateDetails(){
    if(this.stateForm.status == "INVALID"){
      this.stateForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
  
    this.updateLoader = true
    let countryId = this.stateForm.value.country
    let stateName = this.stateForm.value.state.charAt(0).toUpperCase() + this.stateForm.value.state.slice(1)
    let view_in_menu =  this.stateForm.value.menu
    this.campusService.updateStateDetails(stateName,countryId,view_in_menu,this.stateId).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.updateLoader = false  
      Swal.fire({
        text:  'State updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/location/state']);
        } 
      });
      }else{
        this.updateLoader = false 
        Swal.fire('', res.response_message, 'error');
      }
    })
  }
  }

  back(){
    this._route.navigate(['apps/location/state']);
  }
}
