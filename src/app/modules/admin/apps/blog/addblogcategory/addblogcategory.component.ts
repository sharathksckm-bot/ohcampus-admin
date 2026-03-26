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
  selector: 'app-addblogcategory',
  templateUrl: './addblogcategory.component.html',
  styleUrls: ['./addblogcategory.component.scss']
})
export class AddblogcategoryComponent   implements OnInit {

    status: Status[] = [
      {id: '1', name: 'Active'},
      {id: '0', name: 'Inactive'},
    ];

    category : FormGroup;

    showLoader: boolean = false;
    addLoader: boolean = false;
    updateLoader : boolean = false;
    updateButton : boolean = false;
    Loader : boolean = false;
    catId: any;
    //menuOrderValues: number[] = [0,1, 2, 3, 4, 5];
    retriveUserData: any;
    isChecked: any;
    //type = "careers"
    constructor(
      private _formBuilder: FormBuilder,
      private campusService : CampusService,
      public globalService: GlobalService,
      public dialog: MatDialog,
      public _activatedroute: ActivatedRoute,
      public _route: Router,
    ) { }

    ngOnInit(): void {
      this.category = this._formBuilder.group({
        catname:['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
        status: ['',Validators.required],
  })

  const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.catId) {
    this.Loader = true
    this.catId = routeParams.catId;
  }
    }

    ngAfterViewInit(): void {
      if ((this.catId != '' && this.catId != undefined)) {
        setTimeout(() => { this.getCategoryDetailsById(); }, 1000);
      }
    }

    checkValidInputData(event: any, type) {
      this.globalService.checkValidInputData(event, type);
    }

    getCategoryDetailsById(){
      this.updateButton = true
      let catId = this.catId
      this.campusService.getCategoryBlogsDetailsById(catId).subscribe((res) =>{
        if(res.response_message == "Success") {
        this.retriveUserData = res.response_data
        this.category.get('catname').setValue(this.retriveUserData?.name)
        let catStatus
        this.status.forEach((status) => {
          if (status.id == this.retriveUserData?.status) {
            catStatus = status.id;
          }
        });
        this.category.get('status').setValue(catStatus)
        this.Loader = false
        }
      })
    }

    addCategory(){
      if(this.category.status == "INVALID"){
        this.category.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
      this.addLoader = true
      let catname = this.category.value.catname.charAt(0).toUpperCase() + this.category.value.catname.slice(1)
      let status = this.category.value.status
      this.campusService.insertBlogCategoryDetails(catname,
                        status).subscribe((res) =>{
        if(res.response_message == "Success") {
        this.addLoader = false
        Swal.fire({
          text:  'Article category added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/blog/blogcategory']);
          }
        });
        }else{
          this.addLoader = false
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateCategory(){
    if(this.category.status == "INVALID"){
      this.category.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      this.updateLoader = true
    let catname = this.category.value.catname.charAt(0).toUpperCase() + this.category.value.catname.slice(1)
   let status = this.category.value.status

    this.campusService. updateBlogCategoryDetails(this.catId,catname,status).subscribe((res) =>{
        if(res.response_message == "Success") {
          this.updateLoader = false
        Swal.fire({
          text:  ' Article category updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/blog/blogcategory']);
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
    this._route.navigate(['apps/blog/blogcategory']);
  }
  }


