import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
interface Course {
    id: string;
    name: string;
  }

@Component({
  selector: 'app-addsubcategory',
  templateUrl: './addsubcategory.component.html',
  styleUrls: ['./addsubcategory.component.scss']
})
export class AddsubcategoryComponent implements OnInit {
    subcategoryForm : FormGroup;
    showLoader: boolean = false;
    addLoader: boolean = false;
    updateLoader : boolean = false;
    updateButton : boolean = false;
    subLoader : boolean = false;
    Loader : boolean = false;
    courseId: any;
    coueseDetails: any;
    courseList: any;
    courseData: any;
    Image: any;
    landing_img: any;
    uploaded_img: any;
    tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
    uploaded_supporting_docs1: any;
    uploadDocs1: any;
    image : any;
    ImageName: any;
    subCourseList: any;
      isChecked: any;
    id: string;

    constructor(
      private _formBuilder: FormBuilder,
      private campusService : CampusService,
      public globalService: GlobalService,
      public dialog: MatDialog,
      public _activatedroute: ActivatedRoute,
      public _route: Router) { }

      ngOnInit(): void {
        this.subcategoryForm = this._formBuilder.group({
            name: ['',[Validators.required]],
            eligibility : [''],
          category : ['',Validators.required],
          level : ['',Validators.required],

    })

    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.catId) {
   this.Loader = true
    this.updateButton = true
    this.id = routeParams.catId;
    }

    this.getAcCategoryForCourse();
    this.getCategoryForCourse();

  }

  ngAfterViewInit(): void {
    if ((this.id != '' && this.id != undefined)) {
      setTimeout(() => { this.getSubCategoryDetailsById(); }, 1500);
    }
  }


  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getAcCategoryForCourse(){
    this.campusService.getAcCategoryForCourse().subscribe((res) =>{
      this.courseList = res.response_data


    })
  }

  getCategoryForCourse(){
    this.campusService.getCategoryForCourse().subscribe((res) =>{
      this.courseData = res.response_data
    })
  }


  getSubCategoryDetailsById(){
    this.campusService.getSubCategoryDetailsById(this.id).subscribe((res) =>{
    if(res.response_message == "Success"){
    this.coueseDetails = res.response_data[0]
    this.subcategoryForm.get('eligibility').setValue(this.coueseDetails.eligibility)
    this.subcategoryForm.get('name').setValue(this.coueseDetails.subcat)

    let level
    this.courseList.forEach((item) => {

        if(item.category_id == this.coueseDetails.academic_category){
            level = item.category_id
      }
    });
    this.subcategoryForm.get('level').setValue(level)

    let category
    this.courseData.forEach((item) => {


      if(item.id == this.coueseDetails.parent_category){
        category = item.id
      }
    });
    this.subcategoryForm.get('category').setValue(category)





    this.Loader = false
    }else{
      this.Loader = false
    }
    })
  }

  insertSubCategoryDetails(){
    if(this.subcategoryForm.status == "INVALID"){
      this.subcategoryForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.addLoader = true
    let name = this.subcategoryForm.value.name.charAt(0).toUpperCase() + this.subcategoryForm.value.name.slice(1)
    let eligibility = this.subcategoryForm.value.eligibility
    let catid =this.subcategoryForm.value.category
    let level =this.subcategoryForm.value.level

    this.campusService.insertSubCategoryDetails(catid,level,eligibility,name).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.addLoader = false
        Swal.fire({
          text:  'New Subcategory added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/college/subcategory']);
          }
        });
      }else{
        this.addLoader = false
        Swal.fire('', res.response_message , 'error')
      }
    })
  }
  }

  updateSubCategoryDetails(){
    console.log(this,this.subcategoryForm.value)
    if(this.subcategoryForm.status == "INVALID"){
      this.subcategoryForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      this.updateLoader = true
      let name = this.subcategoryForm.value.name.charAt(0).toUpperCase() + this.subcategoryForm.value.name.slice(1)
    let eligibility = this.subcategoryForm.value.eligibility
    let catid =this.subcategoryForm.value.category
    let level =this.subcategoryForm.value.level


    this.campusService.updateSubCategoryDetails( this.id, catid,level,eligibility,name).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text:  'Subcategory updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/college/subcategory']);
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
    this._route.navigate(['apps/college/subcategory']);
  }


  }

