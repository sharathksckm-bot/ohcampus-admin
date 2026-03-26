import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addpackage',
  templateUrl: './addpackage.component.html',
  styleUrls: ['./addpackage.component.scss']
})
export class AddpackageComponent implements OnInit {
  packageForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  retriveUserData: any;
  pkgId: any;

constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.packageForm = this._formBuilder.group({
      name: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
      price: ['',[Validators.required]],
    })

    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.pkgId) {
      this.Loader = true
      this.pkgId = routeParams.pkgId;
    }
  }

  ngAfterViewInit(): void {
    if ((this.pkgId != '' && this.pkgId != undefined)) {
      setTimeout(() => { this.getPackagesDetailsById(); }, 1000);
    }
  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getPackagesDetailsById(){
    this.updateButton = true 
    this.campusService.getPackagesDetailsById(this.pkgId).subscribe((res) =>{
      if(res.response_message == "Success") { 
      this.retriveUserData = res.response_data

      this.packageForm.get('name').setValue(this.retriveUserData?.name)
      this.packageForm.get('price').setValue(this.retriveUserData?.price)
      this.Loader = false
      }
    })
  }

  insertPackagesDetails(){
    if(this.packageForm.status == "INVALID"){
      this.packageForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.addLoader = true
    let name = this.packageForm.value.name.charAt(0).toUpperCase() + this.packageForm.value.name.slice(1)

    this.campusService.insertPackagesDetails(name,this.packageForm.value.price).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.addLoader = false  
      Swal.fire({
        text:  'New package added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/package/packagelist']);
        } 
      });
      }else{
        this.addLoader = false 
        Swal.fire('', res.response_message, 'error');
      }
    })
  }
}

updatePackagesDetails(){
  if(this.packageForm.status == "INVALID"){
    this.packageForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.updateLoader = true
  let name = this.packageForm.value.name.charAt(0).toUpperCase() + this.packageForm.value.name.slice(1)

  this.campusService.updatePackagesDetails(this.pkgId,name,this.packageForm.value.price).subscribe((res) =>{
    if(res.response_message == "Success") {                                
    this.updateLoader = false  
    Swal.fire({
      text:  'Package details updated successful',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: "#3290d6 !important",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this._route.navigate(['apps/package/packagelist']);
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
  this._route.navigate(['apps/package/packagelist']);
}
}
