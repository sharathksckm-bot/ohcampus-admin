import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addscholership',
  templateUrl: './addscholership.component.html',
  styleUrls: ['./addscholership.component.scss']
})
export class AddscholershipComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  scholarshipForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  retriveData: any;
  scholarId: any;
  landing_img: any;
  uploaded_img: any;
  Image: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  image: any;
  file_link:any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.scholarshipForm = this._formBuilder.group({
        provider_name: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150)]],
        name: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150)]],
        type: ['link',[Validators.required]],
        linkValue: [''],
        scholarDocument_FrontFilePath : [''],
        scholarDocument_FrontFileType:'',
        scholarDocument_FrontFileName:'',
      })
  
      const routeParams = this._activatedroute.snapshot.params;
      if (routeParams.scholarId) {
        this.Loader = true
        this.scholarId = routeParams.scholarId;
      }
    }


    ngAfterViewInit(): void {
      if ((this.scholarId != '' && this.scholarId != undefined)) {
        setTimeout(() => { this.getScholarshipsDetailsById(); }, 1000);
      }
    }

    checkValidInputData(event: any, type) {
      this.globalService.checkValidInputData(event, type);
    }

    getScholarshipsDetailsById(){
      this.updateButton = true 
      this.campusService.getScholarshipsDetailsById(this.scholarId).subscribe((res) =>{
        if(res.response_message == "Success") { 
        this.retriveData = res.response_data
  
        this.scholarshipForm.get('provider_name').setValue(this.retriveData?.provider_name)
        this.scholarshipForm.get('name').setValue(this.retriveData?.name)
        this.scholarshipForm.get('type').setValue(this.retriveData?.type)
        if(this.retriveData?.type == "link"){
          this.scholarshipForm.get('linkValue').setValue(this.retriveData?.file_or_link)
        }else{
          this.scholarshipForm.get('scholarDocument_FrontFileName').setValue(this.retriveData?.file_or_link)
          this.scholarshipForm.get('scholarDocument_FrontFilePath').setValue(this.retriveData?.imagepath)
        }  

        this.Loader = false
        }
      })
    }

    typeValue(){
      if(this.scholarshipForm.value.type == "link"){
        this.scholarshipForm.get('linkValue').setValidators(Validators.required)
          this.scholarshipForm.get('linkValue')?.updateValueAndValidity()
      }else{
        this.scholarshipForm.get('linkValue').setValidators(null)
          this.scholarshipForm.get('linkValue')?.updateValueAndValidity()
      }
    }

    insertScholarshipsDetails(){
      if(this.scholarshipForm.status == "INVALID"){
        this.scholarshipForm.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
        if(this.scholarshipForm.value.scholarDocument_FrontFilePath =='' && this.scholarshipForm.value.type == "file"){
          Swal.fire('', 'Please upload document', 'error')
          return
        }
      
      this.addLoader = true
      let provider_name = this.scholarshipForm.value.provider_name.charAt(0).toUpperCase() + this.scholarshipForm.value.provider_name.slice(1)
      let name = this.scholarshipForm.value.name.charAt(0).toUpperCase() + this.scholarshipForm.value.name.slice(1)
      let type = this.scholarshipForm.value.type
      if(type == "link"){
        this.file_link = this.scholarshipForm.value.linkValue
      }else{
        this.file_link = this.scholarshipForm.value.scholarDocument_FrontFileName
      }
  
      this.campusService.insertScholarshipsDetails(provider_name,name,type,this.file_link).subscribe((res) =>{
        if(res.response_message == "Success") {                                
        this.addLoader = false  
        Swal.fire({
          text:  'New scholarship added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/scholerships/scholershiplist']);
          } 
        });
        }else{
          this.addLoader = false 
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateScholarshipsDetails(){
    if(this.scholarshipForm.status == "INVALID"){
      this.scholarshipForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      if(this.scholarshipForm.value.scholarDocument_FrontFilePath=='' && this.scholarshipForm.value.type == "file"){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
    this.updateLoader = true
    let provider_name = this.scholarshipForm.value.provider_name.charAt(0).toUpperCase() + this.scholarshipForm.value.provider_name.slice(1)
    let name = this.scholarshipForm.value.name.charAt(0).toUpperCase() + this.scholarshipForm.value.name.slice(1)
    let type = this.scholarshipForm.value.type
    if(type == "link"){
      this.file_link = this.scholarshipForm.value.linkValue
    }else{
        this.file_link = this.scholarshipForm.value.scholarDocument_FrontFileName
    }
    this.campusService.updateScholarshipsDetails(this.scholarId,provider_name,name,this.scholarshipForm.value.type,this.file_link).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.updateLoader = false  
      Swal.fire({
        text:  'Scholarship details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/scholerships/scholershiplist']);
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
    this._route.navigate(['apps/scholerships/scholershiplist']);
  }

  onFileChange(event, docName, files: FileList) {
    this.Image = null
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    if (docName == 'scholarDocument') {
      this.showLoader = true;
    }
    this.campusService.ScholarUploadDocs(formData).subscribe(res => {
  
    if(res.response_message == "success"){
      this.landing_img = res.File;
      this.uploaded_img = res.FileDir;
      let fileType = res.File.split(".");
      fileType = fileType[fileType.length - 1];
      fileType = fileType == "pdf" ? "PDF" : "IMG";
      let formArrayValue: any = this.scholarshipForm.value;
      formArrayValue[docName] = res.File;
      formArrayValue[docName + "FilePath"] = res.FileDir;
      this.tempDocumentArray2 = {
        file_name: docName,
        file_dir: res.FileDir,
        docName: res.File,
        DocumentExtn: "png",
      }
      console.log(this.tempDocumentArray2 )
      if (docName == 'scholarDocument') {
        this.showLoader = false;
        this.scholarshipForm?.get('scholarDocument_FrontFilePath')?.setValue(res.FileDir);
        this.scholarshipForm?.get('scholarDocument_FrontFileType')?.setValue(fileType);
        this.scholarshipForm?.get('scholarDocument_FrontFileName')?.setValue(res.File);
      }
    
      if (this.tempDocumentArray2.file_name == 'scholarDocument') {
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
