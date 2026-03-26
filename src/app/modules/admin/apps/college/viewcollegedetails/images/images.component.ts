 import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @Input() collegeDetails: any;
  @Input() imageData: any;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  imagesForm : FormGroup;
  showLoader: boolean = false;
  showLoader2: boolean = false;
  showLoader3: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  page: number = 1;
  pageSize: number = 10;
  columnIndex: number = 0;
  startNum: number = 1;
  sortValue: string = "desc";
  search: string = "";
  retriveData: any;
  image: any;
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  tempDocumentArray2: any;
  landing_img: any;
  uploaded_img: any;
  Image: any;
  type: string = 'college'
  clgId: any;
  logoImage: any;
  bannerImage: any;
  collegeImage: any;
  uploaded: { id: string;  imageName: any; };
  postId: any;
  multipleCollegeImages: any = []
  multipleCollegeImages2: any = []
  commonDocArray: any = [];
  docs: any = [];
  docsName: any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.imagesForm = this._formBuilder.group({
      collegeDocument_FrontFilePath : [''],
      collegeDocument_FrontFileType:'' ,
      collegeDocument_FrontFileName:'' ,
      logoDocument_FrontFilePath : [''],
      logoDocument_FrontFileType:'' ,
      logoDocument_FrontFileName:'' ,
      bannerDocument_FrontFilePath : [''],
      bannerDocument_FrontFileType:'' ,
      bannerDocument_FrontFileName:'' ,
    })

    this.clgId = this.collegeDetails.id
    if ((this.clgId != null)) {
      this.Loader = true
    }
  }


  ngAfterViewInit(): void {
      setTimeout(() => { this.getImagesById(); }, 1500);
  }

  getImagesById(){
      if(this.clgId != null){
      this.updateButton = true

      this.multipleCollegeImages = this.imageData

      this.imagesForm?.get('logoDocument_FrontFileName')?.setValue(this.collegeDetails.logoName);
      this.imagesForm?.get('logoDocument_FrontFilePath')?.setValue(this.collegeDetails.logo);

      this.imagesForm?.get('bannerDocument_FrontFileName')?.setValue(this.collegeDetails.bannerName);
      this.imagesForm?.get('bannerDocument_FrontFilePath')?.setValue(this.collegeDetails.banner);
      this.postId = this.collegeDetails.collegeid
      this.Loader = false
      }
  }



  deleteDoc(imageId,index: number){
   this.campusService.collegeDeleteDoc(imageId).subscribe((res) =>{})
   if (index >= 0 && index < this.multipleCollegeImages.length) {
    this.multipleCollegeImages.splice(index, 1);
  }
   }

   deletClgeDoc(doc,index){
    if (index >= 0 && index < this.docs.length) {
      this.docs.splice(index, 1);
    }

    if (index >= 0 && index < this.docsName.length) {
      this.docsName.splice(index, 1);
    }
   }

  collegeSaveDoc(){
    // if(this.imagesForm.value.collegeDocument_FrontFilePath == '' && this.multipleCollegeImages.length == 0 ){
    //   Swal.fire('', 'Please upload college photo', 'error')
    //   return
    // }

    // if(this.imagesForm.value.logoDocument_FrontFileName ==''){
    //   Swal.fire('', 'Please upload college logo', 'error')
    //   return
    // }
    // if(this.imagesForm.value.bannerDocument_FrontFileName ==''){
    //   Swal.fire('', 'Please upload college banner', 'error')
    //   return
    // }

    this.updateLoader = true
    let type = this.type
    let clgId = this.collegeDetails.id
    this.logoImage = this.imagesForm.value.logoDocument_FrontFileName
    this.bannerImage = this.imagesForm.value.bannerDocument_FrontFileName
    if(this.docsName != null){
    this.commonDocArray = this.multipleCollegeImages.concat(this.docsName);
    }else{
    this.commonDocArray = this.multipleCollegeImages
  }
    this.collegeImage = this.commonDocArray

    this.campusService.collegeSaveDoc(clgId,this.logoImage,this.bannerImage,type,this.collegeImage).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text:  'College document added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendValueToParent()
           }
        });
      }else{
        this.updateLoader = false
        Swal.fire('', res.response_message , 'error')
      }
    })
  }

  onFileChange(event, docName, files: FileList) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    if (docName == 'collegeDocument') {
      this.showLoader = true;
    }
    if (docName == 'logoDocument') {
      this.showLoader2 = true;
    }
    if (docName == 'bannerDocument') {
      this.showLoader3 = true;
    }
    this.campusService.collegeUploadDocs(formData).subscribe(res => {

    if(res.response_message == "success"){
      this.landing_img = res.File;
      this.uploaded_img = res.FileDir;
      let fileType = res.File.split(".");
      fileType = fileType[fileType.length - 1];
      fileType = fileType == "pdf" ? "PDF" : "IMG";
      let formArrayValue: any = this.imagesForm.value;
      formArrayValue[docName] = res.File;
      formArrayValue[docName + "FilePath"] = res.FileDir;
      this.tempDocumentArray2 = {
        file_name: docName,
        file_dir: res.FileDir,
        docName: res.File,
        DocumentExtn: "png",
      }
      console.log(this.tempDocumentArray2 )
      if (docName == 'collegeDocument') {
        this.showLoader = false;
        this.imagesForm?.get('collegeDocument_FrontFilePath')?.setValue(res.FileDir);
        this.imagesForm?.get('collegeDocument_FrontFileType')?.setValue(fileType);
        this.imagesForm?.get('collegeDocument_FrontFileName')?.setValue(res.File);
      }
      if (docName == 'logoDocument') {
        this.showLoader2 = false;
        this.imagesForm?.get('logoDocument_FrontFilePath')?.setValue(res.FileDir);
        this.imagesForm?.get('logoDocument_FrontFileType')?.setValue(fileType);
        this.imagesForm?.get('logoDocument_FrontFileName')?.setValue(res.File);
      }
      if (docName == 'bannerDocument') {
        this.showLoader3 = false;
        this.imagesForm?.get('bannerDocument_FrontFilePath')?.setValue(res.FileDir);
        this.imagesForm?.get('bannerDocument_FrontFileType')?.setValue(fileType);
        this.imagesForm?.get('bannerDocument_FrontFileName')?.setValue(res.File);
      }

      if (this.tempDocumentArray2.file_name == 'collegeDocument') {
        this.uploaded_supporting_docs1 = this.uploaded = {
                                                  id: '',
                                                  imageName: this.tempDocumentArray2.docName,
                                                   };

        this.uploadDocs1 = res.FileDir;
        this.docsName.push(this.uploaded_supporting_docs1);
        this.docs.push(this.uploadDocs1);
        console.log(this.docs)
        console.log( this.docsName)
      }
      if (this.tempDocumentArray2.file_name == 'logoDocument') {
        this.uploadDocs1 = this.tempDocumentArray2.file_dir;
      }
      if (this.tempDocumentArray2.file_name == 'bannnerDocument') {
        this.uploadDocs1 = this.tempDocumentArray2.file_dir;
      }

      this.dialog.closeAll();
    }else{
      this.showLoader = false;
      this.showLoader2 = false;
      this.showLoader3 = false;
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

  back(){
    this.sendValueToParent2();
  }

  sendValueToParent2() {
    const valueToSend = "0";
    this.valueChanged.emit(valueToSend);
  }

  sendValueToParent() {
    const valueToSend = "2";
    this.valueChanged.emit(valueToSend);
  }
}
