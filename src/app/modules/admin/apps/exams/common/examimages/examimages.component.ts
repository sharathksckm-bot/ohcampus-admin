import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamdetailsComponent } from '../examdetails/examdetails.component';

@Component({
  selector: 'app-examimages',
  templateUrl: './examimages.component.html',
  styleUrls: ['./examimages.component.scss']
})

export class ExamimagesComponent implements OnInit {
  @Input() examDetails: any;
  @Input() imageDetails: any;

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();

  addImage : FormGroup;
  showLoader: boolean = false;
  Loader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  retriveexamData: any;
  examId: any;
  landing_img: any;
  uploaded_img: any;
  Image: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  image: any;
  file_link:any;
  type : string = "exams"
  localStorageData: any;
  postId: any;
  Imagee: any = [];
  uploaded: { id: string; imageName: any; };
  multipleExamDocs: any = [];
  commonDocArray: any = [];
  type2: string;

  

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {

      this.addImage = this._formBuilder.group({
        examDocument_FrontFilePath : [''],
        examDocument_FrontFileType:'' ,
        examDocument_FrontFileName:'' ,
      })

      
      this.postId = this.examDetails.id
      if(this.postId != null){
        this.updateButton = true
        this.Loader = true
      }
    }

    ngAfterViewInit(): void {
      if ((this.postId != null)) {
        this.getExamDetailsByIddd();
      }else{
        this.postId = JSON.parse(localStorage.getItem("postId"));
      }
    }

    getExamDetailsByIddd(){
      this.multipleExamDocs = this.imageDetails
      setTimeout(() => { this.Loader = false; }, 500);
    }

    deleteDoc(imageId,index: number){
     this.campusService.ExamDeleteDoc(imageId).subscribe((res) =>{})
     if (index >= 0 && index < this.multipleExamDocs.length) {
      this.multipleExamDocs.splice(index, 1);
    }
    }

    saveDoc(){ 
      if(this.addImage.value.examDocument_FrontFilePath ==''){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
      this.addLoader = true
      this.postId = JSON.parse(localStorage.getItem("postId"));
      this.Imagee = this.multipleExamDocs.concat(this.uploaded_supporting_docs1);
      this.campusService.SaveDoc(this.postId,this.type,this.Imagee).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.addLoader = false
          Swal.fire({
            text:  'New exam document added successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.sendValueToParent();
            } 
          });
        }else{
          this.addLoader = false
          Swal.fire('', res.response_message , 'error')
        }
      })
    }

    updateSaveDoc(){ 
      if(this.addImage.value.examDocument_FrontFilePath =='' &&  this.multipleExamDocs.length == 0){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
      this.updateLoader = true
      if(this.uploaded_supporting_docs1 != null){
        this.commonDocArray = this.multipleExamDocs.concat(this.uploaded_supporting_docs1);
      }else{
        this.commonDocArray = this.multipleExamDocs
      }
       this.Imagee = this.commonDocArray
     
      
      this.campusService.SaveDoc(this.postId,this.type,this.Imagee).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.addLoader = false
          Swal.fire({
            text:  ' Exam document updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.sendValueToParent();
            } 
          });
        }else{
          this.updateLoader = false
          Swal.fire('', res.response_message , 'error')
        }
      })
    }

    onFileChange(event, docName, files: FileList,type) {
      const formData = new FormData();
      formData.append('file', event.target.files[0] );
      formData.append('type',type );
      if (docName == 'examDocument') {
        this.showLoader = true;
      }
      this.campusService.ExamUploadDocs(formData).subscribe(res => {
    
      if(res.response_message == "success"){
        this.landing_img = res.File;
        this.uploaded_img = res.FileDir;
        let fileType = res.File.split(".");
        fileType = fileType[fileType.length - 1];
        fileType = fileType == "pdf" ? "PDF" : "IMG";
        let formArrayValue: any = this.addImage.value;
        formArrayValue[docName] = res.File;
        formArrayValue[docName + "FilePath"] = res.FileDir;
        this.tempDocumentArray2 = {
          file_name: docName,
          file_dir: res.FileDir,
          docName: res.File,
          DocumentExtn: "png",
        }
        console.log(this.tempDocumentArray2 )
        if (docName == 'examDocument') {
          this.showLoader = false;
          this.addImage?.get('examDocument_FrontFilePath')?.setValue(res.FileDir);
          this.addImage?.get('examDocument_FrontFileType')?.setValue(fileType);
          this.addImage?.get('examDocument_FrontFileName')?.setValue(res.File);
        }
      
        if (this.tempDocumentArray2.file_name == 'examDocument') {
          this.uploaded_supporting_docs1 = this.uploaded = {
                                           id: '',
                                           imageName:this.tempDocumentArray2.docName,
                                           }
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

    back(){
      this.sendValueToParent2();
    }

    sendValueToParent() {
      const valueToSend = "2";
      this.valueChanged.emit(valueToSend);
    }

    sendValueToParent2() {
      const valueToSend = "0";
      this.valueChanged.emit(valueToSend);
    }

}

