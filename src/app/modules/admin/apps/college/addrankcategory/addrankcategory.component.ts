import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addrankcategory',
  templateUrl: './addrankcategory.component.html',
  styleUrls: ['./addrankcategory.component.scss']
})
export class AddrankcategoryComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  rnkctgryForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  landing_img: any;
  uploaded_img: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  retriveData: any;
  rankId: any;
  Image: any;
  image: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.rnkctgryForm = this._formBuilder.group({
      title: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
      rankDocument_FrontFilePath : [''],
      rankDocument_FrontFileType:'',
      rankDocument_FrontFileName:'' 
    })

    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.rankId) {
      this.Loader = true
      this.rankId = routeParams.rankId;
    }

  }

  ngAfterViewInit(): void {
    if ((this.rankId != '' && this.rankId != undefined)) {
      setTimeout(() => { this.getRnkCatDetailsById(); }, 1000);
    }
  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getRnkCatDetailsById(){
    this.updateButton = true 
    this.campusService.getRnkCatDetailsById(this.rankId).subscribe((res) =>{
      if(res.response_message == "Success") { 
      this.retriveData = res.response_data

      this.rnkctgryForm.get('title').setValue(this.retriveData?.title)

     this.rnkctgryForm.get('rankDocument_FrontFilePath').setValue(this.retriveData.imagepath)
     this.rnkctgryForm.get('rankDocument_FrontFileName').setValue(this.retriveData.image)
      this.Loader = false
      }
    })
  }

  insertRankCategory(){
    if(this.rnkctgryForm.status == "INVALID"){
      this.rnkctgryForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      if(this.rnkctgryForm.value.rankDocument_FrontFilePath ==''){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
    this.addLoader = true
    let title = this.rnkctgryForm.value.title.charAt(0).toUpperCase() + this.rnkctgryForm.value.title.slice(1)
    let image = this.rnkctgryForm.value.rankDocument_FrontFileName
    this.campusService.insertRankCategory(title,image).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.addLoader = false  
      Swal.fire({
        text:  'New rank category added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/college/rankcategory']);
        } 
      });
      }else{
        this.addLoader = false 
        Swal.fire('', res.response_message, 'error');
      }
    })
  }
}

updateRankCategory(){
  if(this.rnkctgryForm.status == "INVALID"){
    this.rnkctgryForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
    if(this.rnkctgryForm.value.rankDocument_FrontFilePath==''){
      Swal.fire('', 'Please upload document', 'error')
      return
    }
  this.updateLoader = true
  let title = this.rnkctgryForm.value.title.charAt(0).toUpperCase() + this.rnkctgryForm.value.title.slice(1)
  let image = this.rnkctgryForm.value.rankDocument_FrontFileName
  this.campusService.updateRankCategory(this.rankId,title,image).subscribe((res) =>{
    if(res.response_message == "Success") {                                
    this.updateLoader = false  
    Swal.fire({
      text:  'Rank category updated successful',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: "#3290d6 !important",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this._route.navigate(['apps/college/rankcategory']);
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
  this._route.navigate(['apps/college/rankcategory']);
}

onFileChange(event, docName, files: FileList) {
  this.Image = null
  const formData = new FormData();
  formData.append('file', event.target.files[0]);
  if (docName == 'rankDocument') {
    this.showLoader = true;
  }
  this.campusService.uploadimages(formData).subscribe(res => {

  if(res.response_message == "success"){
    this.landing_img = res.File;
    this.uploaded_img = res.FileDir;
    let fileType = res.File.split(".");
    fileType = fileType[fileType.length - 1];
    fileType = fileType == "pdf" ? "PDF" : "IMG";
    let formArrayValue: any = this.rnkctgryForm.value;
    formArrayValue[docName] = res.File;
    formArrayValue[docName + "FilePath"] = res.FileDir;
    this.tempDocumentArray2 = {
      file_name: docName,
      file_dir: res.FileDir,
      docName: res.File,
      DocumentExtn: "png",
    }
    console.log(this.tempDocumentArray2 )
    if (docName == 'rankDocument') {
      this.showLoader = false;
      this.rnkctgryForm?.get('rankDocument_FrontFilePath')?.setValue(res.FileDir);
      this.rnkctgryForm?.get('rankDocument_FrontFileType')?.setValue(fileType);
      this.rnkctgryForm?.get('rankDocument_FrontFileName')?.setValue(res.File);
    }
  
    if (this.tempDocumentArray2.file_name == 'rankDocument') {
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
