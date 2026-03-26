import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addcountry',
  templateUrl: './addcountry.component.html',
  styleUrls: ['./addcountry.component.scss']
})
export class AddcountryComponent implements OnInit {
  countryForm : FormGroup; 
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  countryId: any;
  retriveUserData: any;
  

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.countryForm = this._formBuilder.group({
      country: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),]],
  })

  const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.countryId) {
    this.Loader = true
    this.countryId = routeParams.countryId;
  }
}

ngAfterViewInit(): void {
  if ((this.countryId != '' && this.countryId != undefined)) {
    setTimeout(() => { this.getCountryDetailsById(); }, 1000);
  }
}

getCountryDetailsById(){
  this.updateButton = true  
  this.campusService.getCountryDetailsById(this.countryId).subscribe((res) =>{
    if(res.response_message == "Success") { 
    this.retriveUserData = res.response_data
    
    this.countryForm.get('country').setValue(this.retriveUserData?.country)
  
    this.Loader = false
    }
  })
}

insertCountryDetails(){
  if(this.countryForm.status == "INVALID"){
    this.countryForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{

  this.addLoader = true
  let country = this.countryForm.value.country.charAt(0).toUpperCase() + this.countryForm.value.country.slice(1)
  this.campusService.insertCountryDetails(country).subscribe((res) =>{
    if(res.response_message == "Success") {                                
    this.addLoader = false  
    Swal.fire({
      text:  'New country added successful',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: "#3290d6 !important",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this._route.navigate(['apps/location/country']);
      } 
    });
    }else{
      this.addLoader = false 
      Swal.fire('', res.response_message, 'error');
    }
  })
}
}

updateCountryDetails(){
  if(this.countryForm.status == "INVALID"){
    this.countryForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{

  this.updateLoader = true
  let country = this.countryForm.value.country.charAt(0).toUpperCase() + this.countryForm.value.country.slice(1)
  this.campusService.updateCountryDetails(this.countryId,country).subscribe((res) =>{
    if(res.response_message == "Success") {                                
    this.updateLoader = false  
    Swal.fire({
      text:  'Country updated successful',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: "#3290d6 !important",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this._route.navigate(['apps/location/country']);
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
  this._route.navigate(['apps/location/country']);
}

}
