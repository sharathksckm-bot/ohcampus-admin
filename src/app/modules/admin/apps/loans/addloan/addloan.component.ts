import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addloan',
  templateUrl: './addloan.component.html',
  styleUrls: ['./addloan.component.scss']
})
export class AddloanComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  loanForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  retriveloanData: any;
  loanId: any;
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
      this.loanForm = this._formBuilder.group({
        name: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150)]],
        type: ['link',[Validators.required]],
        linkValue: [''],
        loanDocument_FrontFilePath : [''],
        loanDocument_FrontFileType:'' ,
        loanDocument_FrontFileName:''
      })
  
      const routeParams = this._activatedroute.snapshot.params;
      if (routeParams.loanId) {
        this.Loader = true
        this.loanId = routeParams.loanId;
      }
    }

    ngAfterViewInit(): void {
      if ((this.loanId != '' && this.loanId != undefined)) {
        setTimeout(() => { this.getLoanDetailsById(); }, 1000);
      }
    }
  
    checkValidInputData(event: any, type) {
      this.globalService.checkValidInputData(event, type);
    }

    getLoanDetailsById(){
      this.updateButton = true 
      this.campusService.getLoanDetailsById(this.loanId).subscribe((res) =>{
        if(res.response_message == "Success") { 
        this.retriveloanData = res.response_data
  
        this.loanForm.get('name').setValue(this.retriveloanData?.name)
        this.loanForm.get('type').setValue(this.retriveloanData?.type)
        if(this.retriveloanData?.type == "link"){
          this.loanForm.get('linkValue').setValue(this.retriveloanData?.file_or_link)
        }else{
          this.loanForm.get('loanDocument_FrontFileName').setValue(this.retriveloanData?.file_or_link)
          this.loanForm.get('loanDocument_FrontFilePath').setValue(this.retriveloanData?.imagepath)
        }  

        this.Loader = false
        }
      })
    }

    typeValue(){
      if(this.loanForm.value.type == "link"){
        this.loanForm.get('linkValue').setValidators(Validators.required)
          this.loanForm.get('linkValue')?.updateValueAndValidity()
      }else{
        this.loanForm.get('linkValue').setValidators(null)
          this.loanForm.get('linkValue')?.updateValueAndValidity()
      }
    }

    insertLoanDetails(){
      if(this.loanForm.status == "INVALID"){
        this.loanForm.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
        if(this.loanForm.value.loanDocument_FrontFilePath =='' && this.loanForm.value.type == "file"){
          Swal.fire('', 'Please upload document', 'error')
          return
        }
      
      this.addLoader = true
      let name = this.loanForm.value.name.charAt(0).toUpperCase() + this.loanForm.value.name.slice(1)
      let type = this.loanForm.value.type
      if(type == "link"){
        this.file_link = this.loanForm.value.linkValue
      }else{
        this.file_link = this.loanForm.value.loanDocument_FrontFileName
      }
  
      this.campusService.insertLoanDetails(name,type,this.file_link).subscribe((res) =>{
        if(res.response_message == "Success") {                                
        this.addLoader = false  
        Swal.fire({
          text:  'New loan added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/loans/loanlist']);
          } 
        });
        }else{
          this.addLoader = false 
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateLoanDetails(){
    if(this.loanForm.status == "INVALID"){
      this.loanForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      if(this.loanForm.value.loanDocument_FrontFilePath=='' && this.loanForm.value.type == "file"){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
    this.updateLoader = true
    let name = this.loanForm.value.name.charAt(0).toUpperCase() + this.loanForm.value.name.slice(1)
    let type = this.loanForm.value.type
    if(type == "link"){
      this.file_link = this.loanForm.value.linkValue
    }else{
        this.file_link = this.loanForm.value.loanDocument_FrontFileName
    }
    this.campusService.updateLoanDetails(this.loanId,name,this.loanForm.value.type,this.file_link).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.updateLoader = false  
      Swal.fire({
        text:  'Loan details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/loans/loanlist']);
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
    this._route.navigate(['apps/loans/loanlist']);
  }

  onFileChange(event, docName, files: FileList) {
    this.Image = null
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    if (docName == 'loanDocument') {
      this.showLoader = true;
    }
    this.campusService.uploadDocs(formData).subscribe(res => {
  
    if(res.response_message == "success"){
      this.landing_img = res.File;
      this.uploaded_img = res.FileDir;
      let fileType = res.File.split(".");
      fileType = fileType[fileType.length - 1];
      fileType = fileType == "pdf" ? "PDF" : "IMG";
      let formArrayValue: any = this.loanForm.value;
      formArrayValue[docName] = res.File;
      formArrayValue[docName + "FilePath"] = res.FileDir;
      this.tempDocumentArray2 = {
        file_name: docName,
        file_dir: res.FileDir,
        docName: res.File,
        DocumentExtn: "png",
      }
      console.log(this.tempDocumentArray2 )
      if (docName == 'loanDocument') {
        this.showLoader = false;
        this.loanForm?.get('loanDocument_FrontFilePath')?.setValue(res.FileDir);
        this.loanForm?.get('loanDocument_FrontFileType')?.setValue(fileType);
        this.loanForm?.get('loanDocument_FrontFileName')?.setValue(res.File);
      }
    
      if (this.tempDocumentArray2.file_name == 'loanDocument') {
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
