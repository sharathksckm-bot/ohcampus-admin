import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';


interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-addfaqs',
  templateUrl: './addfaqs.component.html',
  styleUrls: ['./addfaqs.component.scss']
})
export class AddfaqsComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
     uploadUrl: '',
     uploadWithCredentials: true,

};
  
  status: Status[] = [
    {id: '1', name: 'Active'},
    {id: '0', name: 'Inactive'},
  ];
  faqsForm : FormGroup; 
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  sortValue: string = "asc";
  retriveData: any;
  CategoryList: any;
  type: string = "faq";
  faqsId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.faqsForm = this._formBuilder.group({
        heading: ['',[Validators.required,Validators.minLength(3)]],
        catType : ['',Validators.required],
        description : ['',[Validators.required,Validators.minLength(3)]],
        status : ['',Validators.required],
  })

  
  this.getCategoryListByType()

  const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.faqsId) {
  this.Loader = true
  this.faqsId = routeParams.faqsId;
  }
}

getCategoryListByType(){
  this.campusService.getCategoryListByType(this.type).subscribe((res) =>{
    this.CategoryList = res.response_data
  }) 
}

ngAfterViewInit(): void {
  if ((this.faqsId != '' && this.faqsId != undefined)) {
    setTimeout(() => { this.getFaqDetailsById(); }, 1000);
  }
}

getFaqDetailsById(){
  this.updateButton = true 
  this.campusService.getFaqDetailsById(this.faqsId).subscribe((res) =>{
  if(res.response_message == "Success"){
  this.retriveData = res.response_data

  //college name
  this.faqsForm.get('heading').setValue(this.retriveData.heading)
  this.faqsForm.get('description').setValue(this.retriveData.description)

  //category type
  let catType
  this.CategoryList.forEach((type) => {
    if (type.id == this.retriveData.categoryid) {
      catType = type.id;
    }
  });
  this.faqsForm.get('catType').setValue(catType)

  //status
  let Status
  this.status.forEach((status) => {
    if (status.id == this.retriveData.status) {
      Status = status.id;
    }
  });
  this.faqsForm.get('status').setValue(Status) 

  this.Loader = false
  
 }
  });
}

insertFaqDetails(){
  if(this.faqsForm.status == "INVALID"){
    this.faqsForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.addLoader = true
  let heading = this.faqsForm.value.heading.charAt(0).toUpperCase() + this.faqsForm.value.heading.slice(1)
  let categoryid = this.faqsForm.value.catType
  console.log(this.faqsForm.value.catType)
  let description = this.faqsForm.value.description
  let status = this.faqsForm.value.status

  this.campusService.insertFaqDetails(categoryid,heading,description,status).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.addLoader = false
      Swal.fire({
        text:  'New FAQs details added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/faqs/faqslist']);
        } 
      });
    }else{
      this.addLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })
}
}

updateFaqDetails(){
  if(this.faqsForm.status == "INVALID"){
    this.faqsForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.updateLoader = true
  let heading = this.faqsForm.value.heading.charAt(0).toUpperCase() + this.faqsForm.value.heading.slice(1)
  let categoryid = this.faqsForm.value.catType
  let description = this.faqsForm.value.description
  let status = this.faqsForm.value.status
  
  this.campusService.updateFaqDetails(this.faqsId,categoryid,heading,description,status).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.updateLoader = false
      Swal.fire({
        text:  'FAQs details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/faqs/faqslist']);
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
  this._route.navigate(['apps/faqs/faqslist']);
}


}
