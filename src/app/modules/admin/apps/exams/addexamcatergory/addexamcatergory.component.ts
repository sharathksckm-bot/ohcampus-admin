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
  selector: 'app-addexamcatergory',
  templateUrl: './addexamcatergory.component.html',
  styleUrls: ['./addexamcatergory.component.scss']
})
export class AddexamcatergoryComponent   implements OnInit {

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
    menuOrderValues: number[] = [0,1, 2, 3, 4, 5];
    retriveUserData: any;
    isChecked: any;
    type = "exams"
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
        topmenu: [0,Validators.required],
        menuorder: [''],
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

    updateTopMenuValue(event: any) {
      this.isChecked = event.checked;
      this.category.get('topmenu').setValue(this.isChecked ? 1 : 0);
    }

    getCategoryDetailsById(){
      this.updateButton = true
      let catId = this.catId
      this.campusService.getCategoryDetailsById(catId, this.type).subscribe((res) =>{
        if(res.response_message == "Success") {
        this.retriveUserData = res.response_data

        this.category.get('catname').setValue(this.retriveUserData?.catname)

        if(this.retriveUserData?.topmenu == 1){
          this.category.get('topmenu').setValue(1)
        }else{
          this.category.get('topmenu').setValue(0)
        }

        let menu
        this.menuOrderValues.forEach((value) => {
          if (value == this.retriveUserData?.menuorder) {
            menu = value;
          }
        });
        this.category.get('menuorder').setValue(menu)

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
      let topmenu = this.category.value.topmenu
      let menuorder = this.category.value.menuorder
      let status = this.category.value.status
      //let type = "college"


      this.campusService.insertCategoryDetails(catname,topmenu,
                          menuorder,status, this.type,).subscribe((res) =>{
        if(res.response_message == "Success") {
        this.addLoader = false
        Swal.fire({
          text:  'Exam category added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/exams/examscategory']);
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
    let topmenu = this.category.value.topmenu
    let menuorder = this.category.value.menuorder
    let status = this.category.value.status

    this.campusService.updateCategoryDetails(catname,topmenu,
                          menuorder,status,  this.catId, this.type,).subscribe((res) =>{
        if(res.response_message == "Success") {
          this.updateLoader = false
        Swal.fire({
          text:  ' Exam category updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/exams/examscategory']);
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
    this._route.navigate(['apps/exams/examscategory']);
  }
  }

