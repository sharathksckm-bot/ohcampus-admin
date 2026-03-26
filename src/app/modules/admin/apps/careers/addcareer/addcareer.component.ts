import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
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
  selector: 'app-addcareer',
  templateUrl: './addcareer.component.html',
  styleUrls: ['./addcareer.component.scss']
})
export class AddcareerComponent implements OnInit {
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

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  careerForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  retriveData: any;
  careerId: any;
  landing_img: any;
  uploaded_img: any;
  Image: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  image: any;
  file_link:any;
  careerList: any;
  type:string = "careers";
  imageData: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.careerForm = this._formBuilder.group({
        career_name: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150)]],
        category: ['',[Validators.required]],
        status: ['',[Validators.required]],
        description: ['',[Validators.required]],
        careerDocument_FrontFilePath : [''],
        careerDocument_FrontFileType:'' ,
        careerDocument_FrontFileName:'' 
      })
  
      const routeParams = this._activatedroute.snapshot.params;
      if (routeParams.careerId) {
        this.Loader = true
        this.careerId = routeParams.careerId;
      }

      this.getCategoryList()
    }


    ngAfterViewInit(): void {
      if ((this.careerId != '' && this.careerId != undefined)) {
        setTimeout(() => { this.getCareersDetailsById(); }, 1000);
      }
    }

    checkValidInputData(event: any, type) {
      this.globalService.checkValidInputData(event, type);
    }

    getCareersDetailsById(){
      this.updateButton = true 
      this.campusService.getCareersDetailsById(this.careerId).subscribe((res) =>{
        if(res.response_message == "Success") { 
        this.retriveData = res.response_data
        this.imageData = res.image_data[0]
  
        this.careerForm.get('career_name').setValue(this.retriveData?.title)
        this.careerForm.get('description').setValue(this.retriveData?.description)

      //status
      let Career
      this.careerList.forEach((item) => {
        if (item.id == this.retriveData?.categoryid) {
          Career = item.id;
        }
      });
      this.careerForm.get('category').setValue(Career)

      //status
      let Status
      this.status.forEach((status) => {
        if (status.id == this.retriveData?.status) {
          Status = status.id;
        }
      });
      this.careerForm.get('status').setValue(Status)

      this.careerForm.get('careerDocument_FrontFilePath').setValue(this.imageData?.image)
      this.careerForm.get('careerDocument_FrontFileName').setValue(this.imageData?.imageName)

      this.Loader = false
      }
      })
    }

    getCategoryList(){
      this.campusService.getCategoryListByType(this.type).subscribe((res) =>{
        this.careerList = res.response_data
     
      })
    }
 

   
    insertCareersDetails(){
      if(this.careerForm.status == "INVALID"){
        this.careerForm.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
        if(this.careerForm.value.careerDocument_FrontFilePath =='' ){
          Swal.fire('', 'Please upload document', 'error')
          return
        }
      
      this.addLoader = true
      let name = this.careerForm.value.career_name.charAt(0).toUpperCase() + this.careerForm.value.career_name.slice(1)
      let description = this.careerForm.value.description
      let image = [{imageName : this.careerForm.value.careerDocument_FrontFileName}]
      let categoryid =this.careerForm.value.category
      let status =  this.careerForm.value.status
  
      this.campusService.insertCareersDetails(name,description,image,categoryid,status).subscribe((res) =>{
        if(res.response_message == "Success") {                                
        this.addLoader = false  
        Swal.fire({
          text:  'New career details added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/careers/careerlist']);
          } 
        });
        }else{
          this.addLoader = false 
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateCareersDetails(){
    if(this.careerForm.status == "INVALID"){
      this.careerForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      if(this.careerForm.value.careerDocument_FrontFilePath =='' ){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
    this.updateLoader = true

    let name = this.careerForm.value.career_name.charAt(0).toUpperCase() + this.careerForm.value.career_name.slice(1)
    let description = this.careerForm.value.description
    let image = [
      {
        id:this.imageData.id,
        imageName : this.careerForm.value.careerDocument_FrontFileName
      }
    ]
    let categoryid =this.careerForm.value.category
    let status =  this.careerForm.value.status
    this.campusService.updateCareersDetails(this.careerId,name,description,image,categoryid,status).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.updateLoader = false  
      Swal.fire({
        text:  'Carrer details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/careers/careerlist']);
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
    this._route.navigate(['apps/careers/careerlist']);
  }

  onFileChange(event, docName, files: FileList) {
    this.Image = null
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    if (docName == 'careerDocument') {
      this.showLoader = true;
    }
    this.campusService.CareerUploadDocs(formData).subscribe(res => {
  
    if(res.response_message == "success"){
      this.landing_img = res.File;
      this.uploaded_img = res.FileDir;
      let fileType = res.File.split(".");
      fileType = fileType[fileType.length - 1];
      fileType = fileType == "pdf" ? "PDF" : "IMG";
      let formArrayValue: any = this.careerForm.value;
      formArrayValue[docName] = res.File;
      formArrayValue[docName + "FilePath"] = res.FileDir;
      this.tempDocumentArray2 = {
        file_name: docName,
        file_dir: res.FileDir,
        docName: res.File,
        DocumentExtn: "png",
      }
      console.log(this.tempDocumentArray2 )
      if (docName == 'careerDocument') {
        this.showLoader = false;
        this.careerForm?.get('careerDocument_FrontFilePath')?.setValue(res.FileDir);
        this.careerForm?.get('careerDocument_FrontFileType')?.setValue(fileType);
        this.careerForm?.get('careerDocument_FrontFileName')?.setValue(res.File);
      }
    
      if (this.tempDocumentArray2.file_name == 'careerDocument') {
        this.uploaded_supporting_docs1 = this.tempDocumentArray2.file_dir;
        this.uploadDocs1 = this.tempDocumentArray2.file_dir;
      }
   
      this.dialog.closeAll();
    }else{
      this.showLoader = false;
      Swal.fire('', res.response_message, 'error');
    }
    });
  }
  
  openImgDialog(img) {
    const dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe((result) => { });
    this.image = img;
  }
  close() {
    this.dialog.closeAll();
  }


}
