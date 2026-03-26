import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coursebroucher',
  templateUrl: './coursebroucher.component.html',
  styleUrls: ['./coursebroucher.component.scss']
})
export class CoursebroucherComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() courseDetails: any;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  broucherForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  clgId: any;
  ebroucherIndex: any;
  showAddButton: boolean = false;
  image: any;
  landing_img: any;
  uploaded_img: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploadDocs1: any;
  uploaded: { id: string; imageName: any; };
  uploaded_supporting_docs1: { id: string; imageName: any; };
  uploadDocs=[0];
  length: any;
  courseId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.broucherForm = this._formBuilder.group({
        broucherDoc_FrontFilePath : ['',Validators.required],
        broucherDoc_FrontFileType:'' ,
        broucherDoc_FrontFileName:''
      });

      this.courseId = this.courseDetails.courseid
      this.clgId = this.courseDetails.collegeid

      if(this.courseDetails.brochure != '' && this.courseDetails.brochure != null){
      this.updateButton = true
      this.Loader = true
      this.getDetailsById()
      }
    }

    getDetailsById(){
      if(this.courseId != null){
        this.broucherForm.get('broucherDoc_FrontFilePath').setValue(this.courseDetails.brochure)
        this.Loader = false
      }
    }

    updateBroucherDetails(){

      this.updateLoader = true
      let fieldName = "BROCHURE"
      let total_intake=""
      let median_salary=""

      let fieldDetails = {
        fileName : this.broucherForm.value.broucherDoc_FrontFilePath
      }
      this.campusService.updateCourses(this.clgId,this.courseId,fieldName,fieldDetails).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.updateLoader = false
          Swal.fire({
            text:  'Course broucher updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.forword()

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
      if (docName == 'broucherDoc') {
        this.showLoader = true;
      }
      this.campusService.uploadBrochuresDocs(formData).subscribe(res => {

      if(res.response_message == "success"){
        this.landing_img = res.File;
        this.uploaded_img = res.FileDir;
        let fileType = res.File.split(".");
        fileType = fileType[fileType.length - 1];
        fileType = fileType == "pdf" ? "PDF" : "IMG";
        let formArrayValue: any = this.broucherForm.value;
        formArrayValue[docName] = res.File;
        formArrayValue[docName + "FilePath"] = res.FileDir;
        this.tempDocumentArray2 = {
          file_name: docName,
          file_dir: res.FileDir,
          docName: res.File,
          DocumentExtn: "png",
        }
        if (docName == 'broucherDoc') {
          this.showLoader = false;
          this.broucherForm?.get('broucherDoc_FrontFilePath')?.setValue(res.FileDir);
          this.broucherForm?.get('broucherDoc_FrontFileType')?.setValue(fileType);
          this.broucherForm?.get('broucherDoc_FrontFileName')?.setValue(res.File);
        }

        if (this.tempDocumentArray2.file_name == 'broucherDoc') {
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



    back(){
      this.sendValueToParent2();
    }

    sendValueToParent2() {
      const valueToSend = "2";
      this.valueChanged.emit(valueToSend);
    }

    forword(){
      const index = '3'
      const navigationExtras = {
        queryParams: { index: index}
      };

      this._route.navigate(['apps/college/editcollegedetails/update/'+ this.clgId ], navigationExtras);
    }

}
