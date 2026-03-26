import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-addcounsellingfee',
  templateUrl: './addcounsellingfee.component.html',
  styleUrls: ['./addcounsellingfee.component.scss']
})
export class AddcounsellingfeeComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() examDetails: any;


  examEditData : any = []
  counsellingFeeForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  type: string = "exams";
  examId: any;
  coursesList: any;
  categoryList: any;
  clgTypeList: any;
  SubCategoryList: any;
  feeId: any;
  counsellingData: any;
  examlist: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.counsellingFeeForm = this._formBuilder.group({
      // course: ['',Validators.required],
      clgType : ['',Validators.required],
      catType : ['',Validators.required],
      subCatType : ['',Validators.required],
      amount : ['',Validators.required],
      exam : ['',Validators.required],
      search_course:'',
      search_clgtype:'',
      search_category:'',
      search_subcategory:'',
      search_exam :''
})
const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.feeId) {
  this.Loader = true
  this.updateButton = true
  this.feeId = routeParams.feeId;

  }

this.getCourses();
this.getClgTypes();
this.getCategories();
this.getExamList();
}


ngAfterViewInit(): void {
  if ((this.feeId != '' && this.feeId != undefined)) {
    setTimeout(() => { this.getCounselingFeesById(); }, 1500);
  }
}

getCourses(){
  let search_course = this.counsellingFeeForm.value.search_course
  this.campusService.getCourses(search_course).subscribe((res) =>{
    this.coursesList = res.coursedata
  })
}

getClgTypes(){
  let search_clgtype = this.counsellingFeeForm.value.search_clgtype
  this.campusService.getClgTypes(search_clgtype).subscribe((res) =>{
    this.clgTypeList = res.coursedata
  })
}

getCategories(){
  let search_category = this.counsellingFeeForm.value.search_category
  this.campusService.getCategories(search_category).subscribe((res) =>{
    this.categoryList = res.coursedata
  })
}

getSubCategory(){
  let search_subcategory = this.counsellingFeeForm.value.search_subcategory
  let categoryId = this.counsellingFeeForm.value.catType
  this.campusService.getSubCategory(search_subcategory,categoryId).subscribe((res) =>{
    this.SubCategoryList = res.coursedata

    let subcategory
    this.SubCategoryList.forEach((item) => {
      if(item.id == this.counsellingData?.sub_category){
        subcategory = item.id
      }
    });
    this.counsellingFeeForm.get('subCatType').setValue(subcategory)


  })
}

getExamList(){
  let search_exam = this.counsellingFeeForm.value.search_exam
  this.campusService.getExams(search_exam,'').subscribe((res) =>{
    this.examlist = res.response_data
    });
}

getCounselingFeesById(){
  this.campusService.getCounselingFeesById(this.feeId).subscribe((res) =>{
    if(res.response_message == "Success"){
    this.counsellingData = res.response_data[0]
    this.counsellingFeeForm.value.search_exam = this.counsellingData.examName

    this.getExamList();

    setTimeout(()=>{
    let examName
    this.examlist.forEach((item) => {
        console.log(item)
      if(item.exams_id == this.counsellingData.exam_id){
        examName = item.exams_id
      }
    });
    this.counsellingFeeForm.get('exam').setValue(examName)
    },1000)

    let clgType
    this.clgTypeList.forEach((item) => {
        console.log(item);
      if(item.id == this.counsellingData.college_type){
        clgType = item.id
      }
    });
    this.counsellingFeeForm.get('clgType').setValue(clgType)

    this.counsellingFeeForm.get('catType').setValue(this.counsellingData.category)
    this.getSubCategory()


    this.counsellingFeeForm.get('amount').setValue(this.counsellingData.fees)

    this.Loader = false
   }else{
   this.Loader = false
   }

  })
}



checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

insertCounsellingFeeDetails(){
  if(this.counsellingFeeForm.status == "INVALID"){
    this.counsellingFeeForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.addLoader = true
  let clgType = this.counsellingFeeForm.value.clgType
  let catType = this.counsellingFeeForm.value.catType
  let subCatType = this.counsellingFeeForm.value.subCatType
  let amount = this.counsellingFeeForm.value.amount
  let exam = this.counsellingFeeForm.value.exam

  this.campusService.saveCounselingFees(subCatType,catType,clgType,amount,exam).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.addLoader = false
      Swal.fire({
        text:  'New counselling fees details added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/counsellingfee/counsellingfeelist']);
        }
      });
    }else{
      this.addLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })
}
}

updateCounsellingFeeDetails(){
  if(this.counsellingFeeForm.status == "INVALID"){
    this.counsellingFeeForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.updateLoader = true

  let clgType = this.counsellingFeeForm.value.clgType
  let catType = this.counsellingFeeForm.value.catType
  let subCatType = this.counsellingFeeForm.value.subCatType
  let amount = this.counsellingFeeForm.value.amount
  let exam = this.counsellingFeeForm.value.exam

  this.campusService.updateCounselingFees(subCatType,catType,clgType,amount,this.feeId,exam).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.updateLoader = false
      Swal.fire({
        text:  'Counselling fees details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/counsellingfee/counsellingfeelist']);
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
  this._route.navigate(['apps/counsellingfee/counsellingfeelist']);
}

}
