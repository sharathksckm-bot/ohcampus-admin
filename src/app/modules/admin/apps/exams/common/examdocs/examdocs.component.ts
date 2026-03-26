import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, Form, FormControl } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamdetailsComponent } from '../examdetails/examdetails.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

interface Documents{
  id:string,
  name:string
}

@Component({
  selector: 'app-examdocs',
  templateUrl: './examdocs.component.html',
  styleUrls: ['./examdocs.component.scss']
})
export class ExamdocsComponent implements OnInit {

  displayedColumns: string[] = ['Sr.No','docType' ,'title' ,'documents','actions'];

  @Input() examDetails: any;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatSort) sort:MatSort;
  // @ViewChild('imageFileInput') imageFileInput;

  Documents:Documents[] = [
      {id:'1',name:'Question Paper'},
      {id:'2',name:'Preparation'},
      {id:'3',name:'Syllabus'}

  ]
  docsForm: FormGroup;
  dialogdocsForm:FormGroup;
  showLoader: boolean = false;
  showLoader2: boolean = false;
  showLoader3: boolean = false;
  Loader: boolean = false;
  addLoader: boolean = false;
  updateLoader: boolean = false;
  updateButton: boolean = false;
  retriveexamData: any;
  examId: any;
  landing_img: any;
  uploaded_img: any;
  Image: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  image: any;
  file_link: any;
  type: string = "exams"
  type2: string
  localStorageData: any;
  postId: any;
  Imagee: any;
  uploaded: { id: string; imageName: any; };
  multipleExamDocs: any = [];
  multipleExamDocs2: any = [];
  commonDocArray: any = [];
  quetionPaperDocs: any[] = [];
  docs: any[] = [];
  dialogDocArr:any[]=[];

  dataSource:any;
  ExamDocList:any[];
  dialogDocData:any[];
  recordsTotal: any;
  recordsFiltered: any;
  searchLoader:boolean = false;
  page:number = 1;
  pageSize:number = 10;
  startNum:number = 0;
  columnIndex:number = 1;
  sortValue:string = "desc";
  docId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,
  private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.docsForm = this._formBuilder.group({
      docType:['',Validators.required],
      title:['',Validators.required],
      document_FrontFileType:[''],
      document_FileType:[''],
      document_FileName:[''],
      qusPaperDocument_FrontFilePath: [''],
      qusPaperDocument_FrontFileType: '',
      qusPaperDocument_FrontFileName: '',
      preparationDocument_FrontFilePath: [''],
      preparationDocument_FrontFileType: '',
      preparationDocument_FrontFileName: '',
      SylabusDocument_FrontFilePath: [''],
      SylabusDocument_FrontFileType: '',
      SylabusDocument_FrontFileName: '',
      search:[''],
    })

   this.dialogdocsForm = this._formBuilder.group({
    docType:['',Validators.required],
      title:['',Validators.required],
      document_FrontFileType:[''],
      document_FileType:[''],
      document_FileName:[''],
   })
    this.postId = this.examDetails.id
    console.log(this.postId)
    // alert(this.postId)
    if (this.postId != null) {
      this.updateButton = true
      this.Loader = true
    }

    
  }

  ngAfterViewInit(): void {
    if ((this.postId != null)) {
      this.getExamDocs();
    } else {
      this.postId = JSON.parse(localStorage.getItem("postId"));
    }
  }

  applyFilter(filterValue:string){
     this.searchLoader = true;
     this.getExamDocs()
     setTimeout(()=>{this.searchLoader =false},500);
  }

  onSortChange(event:MatSort){
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active)
    this.getExamDocs()
  }

  onPageChange(event:PageEvent):void{
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = (this.pageSize * (event.pageIndex))
    this.getExamDocs();
  }

  getExamDocs() {

       this.campusService.getExamDocs(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.docsForm.value.search,this.postId).subscribe((res)=>{
          this.ExamDocList = res.data;
          this.recordsTotal = res.recordsTotal;
          this.recordsFiltered = res.recordsFiltered;
          if(this.ExamDocList?.length != 0){
            this.dataSource = new MatTableDataSource<any>(this.ExamDocList);
            this.Loader = false;
            this.dataSource.sort = this.sort;
          }else{
            this.Loader =false;
          }
       })

      this.Loader =false
    // if (this.examDetails.questionpaperPath) {
    //   this.docsForm.get('qusPaperDocument_FrontFilePath').setValue(this.examDetails.questionpaperPath)
    //   this.docsForm.get('qusPaperDocument_FrontFileName').setValue(this.examDetails.questionpaper)
    // }

    // if (this.examDetails.questionpaperPath != '') {
    //   // alert(8980)
    //   this.docsForm.get('preparationDocument_FrontFilePath').setValue(this.examDetails.preparationPath)
    //   this.docsForm.get('preparationDocument_FrontFileName').setValue(this.examDetails.preparation)
    // }
    // if (this.examDetails.syllabusPath) {
    //   this.docsForm.get('SylabusDocument_FrontFilePath').setValue(this.examDetails.syllabusPath)
    //   this.docsForm.get('SylabusDocument_FrontFileName').setValue(this.examDetails.syllabus)
    // }

    // this.quetionPaperDocs = this.examDetails.questionpaperPaths;

    // setTimeout(() => { this.Loader = false; }, 500);
  }

  saveDoc() {
    // if (this.docsForm.value.qusPaperDocument_FrontFileName == '') {
    //   Swal.fire('', 'Please upload question paper document', 'error')
    //   return
    // }
    // if (this.docsForm.value.preparationDocument_FrontFileName == '') {
    //   Swal.fire('', 'Please upload preparation document', 'error')
    //   return
    // }
    // if (this.docsForm.value.SylabusDocument_FrontFileName == '') {
    //   Swal.fire('', 'Please upload syllaubs document', 'error')
    //   return
    // }

    if(this.docsForm.status == "INVALID"){
      this.docsForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    }

    this.addLoader = true
    // this.postId = JSON.parse(localStorage.getItem("postId"));
    let examId = this.postId;
    let questionpaper = this.docsForm.value.qusPaperDocument_FrontFileName
    let preparation = this.docsForm.value.preparationDocument_FrontFileName
    let syllabus = this.docsForm.value.SylabusDocument_FrontFileName

    let docType = '';
    let docName = this.docsForm.get('docType').value.name;
    console.log(this.docsForm.get('docType').value)
    let title = this.docsForm.get('title').value;

    console.log(this.docs)

    this.campusService.SaveExamsDocs(examId,docType,docName,title,this.docs).subscribe((res) => {
      if (res.res_status == "Success") {
        this.addLoader = false
        Swal.fire({
          text: 'New exam document added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendValueToParent();
          }
        });
      } else if(res.res_code === 2){
        Swal.fire('', res.res_massage, 'error')

      } else {
        this.addLoader = false
        Swal.fire('', res.res_massage, 'error')
      }
    })
  }


  updateDoc(event) {
    // if (this.docsForm.value.qusPaperDocument_FrontFileName == '') {
    //   Swal.fire('', 'Please upload question paper document', 'error')
    //   return
    // }
    // if (this.docsForm.value.preparationDocument_FrontFileName == '') {
    //   Swal.fire('', 'Please upload preparation document', 'error')
    //   return
    // }
    // if (this.docsForm.value.SylabusDocument_FrontFileName == '') {
    //   Swal.fire('', 'Please upload syllaubs document', 'error')
    //   return
    // }

    let questionpaper = this.docsForm.value.qusPaperDocument_FrontFileName
    let preparation = this.docsForm.value.preparationDocument_FrontFileName
    let syllabus = this.docsForm.value.SylabusDocument_FrontFileName

    let docType = this.dialogdocsForm.get('docType').value;
    let Title = this.dialogdocsForm.get('title').value;
    let docs = this.dialogDocArr;
    let docFileName:any[] = [];
    this.dialogDocArr.forEach((data)=>{
        docFileName.push(data.document_name);
    })
    let docTypeName;
    if(docType === '1'){
      docTypeName = "Question_Paper"
    }else if(docType === '2'){
      docTypeName = "Preparation"
    }else{
      docTypeName = "Syllabus"
    }
      
  //  console.log(docTypeName)
    console.log(docType+"      "+Title+"       "+docFileName)

    this.campusService.updateExamsDocs(this.docId,this.postId, docType,docTypeName, Title, docFileName).subscribe((res) => {
      if (res.res_code == 1) {
        this.addLoader = false
        Swal.fire({
          text: ' Exam document updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          // if (result.isConfirmed) {
          //   this.sendValueToParent();
          // }
                    this.dialog.closeAll();

        });
      } else {
        this.updateLoader = false
        Swal.fire('', res.response_message, 'error')
      }
    })
  }

 

  uploadMultipleDocuments(event) {

    //  alert(1)
    const formData = new FormData();
    let docName = this.docsForm.get('docType').value;
    
    if(!docName ){
      console.log(docName)
      return Swal.fire('','Please select document type','error')
    }
  
    console.log(docName)
    let type = '';
    if (docName.id == '1') {
      console.log(123)
      this.showLoader = true;
      type = 'QUESTIONPAPER'
      this.docs = [];
    }else if(docName.id == '2'){
      this.showLoader = true;
      type = 'PREPARATION';
      this.docs = [];
    }else{
      this.showLoader = true;
      type = 'SYLLABUS'
      this.docs = [];
    }

    for (var i = 0; i < event.target.files.length; i++) {
      formData.append('file', event.target.files[i]);
      formData.append('type', type);

      this.campusService.ExamUploadDocs(formData).subscribe(res => {
        if (res.response_message == "success") {
          this.landing_img = res.File;
          this.uploaded_img = res.FileDir;
          let fileType = res.File.split(".");
          fileType = fileType[fileType.length - 1];
          fileType = fileType == "pdf" ? "PDF" : "IMG";
          let formArrayValue: any = this.docsForm.value;
          formArrayValue[docName.name] = res.File;
          formArrayValue[docName.name + "FilePath"] = res.FileDir;
          this.tempDocumentArray2 = {
            file_name: docName.name,
            file_dir: res.FileDir,
            docName: res.File,
            DocumentExtn: "png",
          }
          console.log(this.tempDocumentArray2)


          this.showLoader = false;
          // this.docsForm?.get('qusPaperDocument_FrontFilePath')?.setValue(res.FileDir);
          // this.docsForm?.get('qusPaperDocument_FrontFileType')?.setValue(fileType);
          // this.docsForm?.get('qusPaperDocument_FrontFileName')?.setValue(res.File);

          console.log(this.docsForm);
          // console.log(this.tempDocumentArray2);
          this.docs.push(this.tempDocumentArray2);

          console.log(this.docs);
          this.dialog.closeAll();
        } else {
          this.showLoader = false;
          this.showLoader2 = false;
          this.showLoader3 = false;
          Swal.fire('', res.response_message, 'error');
        }

      });


    }
  }

  // uploadMultipleDocuments2(event) {


  //   const formData = new FormData();
  //   let docName = this.dialogdocsForm.get('docType').value;
    
  //   // if(!docName ){
  //   //   console.log(docName)
  //   //   return Swal.fire('','Please select document type','error')
  //   // }
  
  //   console.log(docName)
  //   let type = '';
  //   if (docName.id == '1') {
  //     console.log(123)
  //     this.showLoader = true;
  //     type = 'QUESTIONPAPER'
  //     this.docs = [];
  //   }else if(docName.id == '2'){
  //     this.showLoader = true;
  //     type = 'PREPARATION';
  //     this.docs = [];
  //   }else{
  //     this.showLoader = true;
  //     type = 'SYLLABUS'
  //     this.docs = [];
  //   }

  //   for (var i = 0; i < event.target.files.length; i++) {
  //     formData.append('file', event.target.files[i]);
  //     formData.append('type', type);

  //     this.campusService.ExamUploadDocs(formData).subscribe(res => {
  //       if (res.response_message == "success") {
  //         this.landing_img = res.File;
  //         this.uploaded_img = res.FileDir;
  //         let fileType = res.File.split(".");
  //         fileType = fileType[fileType.length - 1];
  //         fileType = fileType == "pdf" ? "PDF" : "IMG";
  //         let formArrayValue: any = this.docsForm.value;
  //         formArrayValue[docName.name] = res.File;
  //         formArrayValue[docName.name + "FilePath"] = res.FileDir;
  //         this.tempDocumentArray2 = {
  //           file_name: docName.name,
  //           file_dir: res.FileDir,
  //           docName: res.File,
  //           DocumentExtn: "png",
  //         }
  //         console.log(this.tempDocumentArray2)


  //         this.showLoader = false;
  //         // this.docsForm?.get('qusPaperDocument_FrontFilePath')?.setValue(res.FileDir);
  //         // this.docsForm?.get('qusPaperDocument_FrontFileType')?.setValue(fileType);
  //         // this.docsForm?.get('qusPaperDocument_FrontFileName')?.setValue(res.File);

  //         console.log(this.docsForm);
  //         // console.log(this.tempDocumentArray2);
  //         this.docs.push(this.tempDocumentArray2);

  //         console.log(this.docs);
  //         this.dialog.closeAll();
  //       } else {
  //         this.showLoader = false;
  //         this.showLoader2 = false;
  //         this.showLoader3 = false;
  //         Swal.fire('', res.response_message, 'error');
  //       }

  //     });


  //   }
  // }
  uploadMultipleDocuments2(event){
    // alert(2)
    this.dialogDocArr = []
    const formData2 = new FormData();
    let docName = this.dialogdocsForm.get('docType').value;
    console.log(docName)
    if(!docName ){
      console.log(docName)
      return Swal.fire('','Please select document type','error')
    }
  
    console.log(docName)
    let type = '';
    if (docName == '1') {
      console.log(123)
      this.showLoader = true;
      type = 'QUESTIONPAPER'
      this.docs = [];
    }else if(docName == '2'){
      this.showLoader = true;
      type = 'PREPARATION';
      this.docs = [];
    }else{
      this.showLoader = true;
      type = 'SYLLABUS'
      this.docs = [];
    }

    console.log(type)
    console.log(event.target.files.length)
    for (var i = 0; i < event.target.files.length; i++) {
      formData2.append('file', event.target.files[i]);
      formData2.append('type', type);

      this.campusService.ExamUploadDocs(formData2).subscribe(res => {
        // console.log(res.response_message)
        if (res.response_message == "success") {
          this.landing_img = res.File;
          this.uploaded_img = res.FileDir;
          let fileType = res.File.split(".");
          fileType = fileType[fileType.length - 1];
          fileType = fileType == "pdf" ? "PDF" : "IMG";
          let formArrayValue: any = this.docsForm.value;
          formArrayValue[docName.name] = res.File;
          formArrayValue[docName.name + "FilePath"] = res.FileDir;
          this.tempDocumentArray2 = {
            file_name: res.File,
            file_dir: res.FileDir,
            docName: res.File,
            DocumentExtn: "png",
          }
          // console.log(this.tempDocumentArray2)


          this.showLoader = false;
          // this.docsForm?.get('qusPaperDocument_FrontFilePath')?.setValue(res.FileDir);
          // this.docsForm?.get('qusPaperDocument_FrontFileType')?.setValue(fileType);
          // this.docsForm?.get('qusPaperDocument_FrontFileName')?.setValue(res.File);

          // console.log(this.docsForm);
          // console.log(this.tempDocumentArray2);
          this.dialogDocArr.push(this.tempDocumentArray2);

          console.log(this.dialogDocArr);
          // this.dialog.closeAll();
        } else {
          this.showLoader = false;
          this.showLoader2 = false;
          this.showLoader3 = false;
          Swal.fire('', res.response_message, 'error');
        }

      });


    }
  }

  deletClgeDoc(){

  }
  onFileChange(event, docName, files: FileList, type) {
    const formData = new FormData();

    if (docName == 'preparationDocument') {
      this.showLoader2 = true;
    }
    if (docName == 'SylabusDocument') {
      this.showLoader3 = true;
    }

    for (var i = 0; i < event.target.files.length; i++) {
      formData.append('file', event.target.files[i]);
      formData.append('type', type);

      this.campusService.ExamUploadDocs(formData).subscribe(res => {
        if (res.response_message == "success") {
          this.landing_img = res.File;
          this.uploaded_img = res.FileDir;
          let fileType = res.File.split(".");
          fileType = fileType[fileType.length - 1];
          fileType = fileType == "pdf" ? "PDF" : "IMG";
          let formArrayValue: any = this.docsForm.value;
          formArrayValue[docName] = res.File;
          formArrayValue[docName + "FilePath"] = res.FileDir;
          this.tempDocumentArray2 = {
            file_name: docName,
            file_dir: res.FileDir,
            docName: res.File,
            DocumentExtn: "png",
          }
          console.log(this.tempDocumentArray2)

          if (docName == 'preparationDocument') {
            this.showLoader2 = false;
            this.docsForm?.get('preparationDocument_FrontFilePath')?.setValue(res.FileDir);
            this.docsForm?.get('preparationDocument_FrontFileType')?.setValue(fileType);
            this.docsForm?.get('preparationDocument_FrontFileName')?.setValue(res.File);
          }
          if (docName == 'SylabusDocument') {
            this.showLoader3 = false;
            this.docsForm?.get('SylabusDocument_FrontFilePath')?.setValue(res.FileDir);
            this.docsForm?.get('SylabusDocument_FrontFileType')?.setValue(fileType);
            this.docsForm?.get('SylabusDocument_FrontFileName')?.setValue(res.File);
          }

          // if (this.tempDocumentArray2.file_name == 'examDocument') {
          //   this.uploaded_supporting_docs1 = this.uploaded = {
          //                                    id: '',
          //                                    imageName:this.tempDocumentArray2.docName,
          //                                    }
          //   // this.multipleExamDocs2.push(this.uploaded_supporting_docs1);
          //   this.uploadDocs1 = this.tempDocumentArray2.file_dir;
          // }
          this.dialog.closeAll();
        } else {
          this.showLoader = false;
          this.showLoader2 = false;
          this.showLoader3 = false;
          Swal.fire('', res.response_message, 'error');
        }
      });
    }
  }

  openImgDialog(img) {
    const dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe((result) => { });
    this.image = img;
  }
  // close() {
  //   this.dialog.closeAll();
  // }

  back() {
    this.sendValueToParent2();
  }

  sendValueToParent() {
    this._route.navigate(['apps/exams/examlist']);

  }

  sendValueToParent2() {
    const valueToSend = "1";
    this.valueChanged.emit(valueToSend);
  }



  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


      @Input() collegeDetails: any;
  
      @Input() entranceExam: any;
      subcatlist: any;
      subcatExamForm: FormGroup;
      searchControl = new FormControl();
      searchControl1 = new FormControl();
      selectTakeExam: any[] = []; // List for exams to take
      selectUpadteTakeExam: any[] = []; // List for exams to take
  
      entranceExamDetails: any = [];
      ExamsArr: any = []
      filteredExams: any[] = [];
      isLoading: boolean = false;
      // docsForm: FormGroup;
   
      clgId: any;
      isChecked: any;
  
      // selectExam = [];
      descriptionData: any;
      Ids: string;
      faqslist: any = [0];
      categoryList: any;
      faqsIds: any;
      showAddButton: boolean = false;
      faqsId: any;
      selectExam: any[''] = [];
      idData: any = [];
      arrayD = [];
      examlist: any;
      collegeid: null;
      searchControls: FormControl[] = [];
  
  
      exams: any;
      subcategoryname: any;
      staticData: any[] = [];
      retriveUserData: any;
      examIndex: number;
      docType: number;
      ids: any;
      examindex: number;
      subcatid: any;
      tblLoader: boolean = true;
      editLoader: boolean = false;
      tmpfilteredExams: any;



      addExamdetails() {
              let docType = this.docsForm.value.docType;
              let examids = this.docsForm.value.examids;
      
              let examIdsString = examids.join(',');
      
              let examlist = [{
                  docType: docType,
                  examids: examIdsString
              }];
      
              console.log({
                  collegeid: this.clgId,
                  examlist: examlist
              });
      
              this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
                  if (res.response_message === "Success") {
                      this.updateLoader = false;
                      Swal.fire({
                          text: 'Entrance Exam updated successfully',
                          icon: 'success',
                          showCancelButton: false,
                          confirmButtonColor: "#3290d6 !important",
                          confirmButtonText: 'Ok'
                      }).then((result) => {
                          if (result.isConfirmed) {
                              // this.sendValueToParent();
                              //  this.getCollegeSubCat()
                              this.getExamForSubCat()
                          }
                      });
                  } else {
                      Swal.fire('', res.response_message, 'error');
                  }
              });
              this.selectTakeExam = [];
              this.docsForm.reset();
          }
      
          getCollegeSubCat() {
              let collegeid = this.collegeDetails.id
              this.campusService.getCollegeSubCat(collegeid).subscribe((res) => {
                  this.subcatlist = res.response_data
                  this.ids = this.subcatlist.map(item => item.id);
                  console.log("IDs:", this.ids);
              })
          }
      
      
      
      
      
      
          onExamSelect(selectedExams: any[]) {
              this.selectTakeExam = [];
              selectedExams.forEach(examId => {
                  const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
                  if (selectedExam) {
                      this.selectTakeExam.push(selectedExam);
                  }
              });
          }
      
      
      
          onExamUpdateSelect(selectedExams: any[]) {
      
              this.selectUpadteTakeExam = [];
              selectedExams.forEach(examId => {
                  const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
                  if (selectedExam) {
                      this.selectUpadteTakeExam.push(selectedExam);
                  }
              });
      
          }
          removeTakeExam(index: number, examId: string) {
              this.selectTakeExam = this.selectTakeExam.filter(exam => exam.exams_id !== examId);
              const examIds = this.docsForm.get('examids')?.value.filter(id => id !== examId);
              this.docsForm.get('examids')?.setValue(examIds);
          }
      
          removeUpdateTakeExam(index: number, examId: string) {
              this.selectUpadteTakeExam = this.selectUpadteTakeExam.filter(exam => exam.exams_id !== examId);
              const examIds = this.subcatExamForm.get('examids')?.value.filter(id => id !== examId);
              this.subcatExamForm.get('examids')?.setValue(examIds);
          }
      
      
          updateExamDetails() {
              let docType = this.subcatExamForm.value.docType;
              let examids = this.subcatExamForm.value.examids;
      
      
      
              let examIdsString = examids.join(',');
      
              let examlist = [{
                  docType: docType,
                  examids: examIdsString
              }];
      
              console.log({
                  collegeid: this.clgId,
                  examlist: examlist
              });
      
              this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
                  if (res.response_message === "Success") {
                      this.updateLoader = false;
                      Swal.fire({
                          text: 'Entrance Exam updated successfully',
                          icon: 'success',
                          showCancelButton: false,
                          confirmButtonColor: "#3290d6 !important",
                          confirmButtonText: 'Ok'
                      }).then((result) => {
                          if (result.isConfirmed) {
                              // this.sendValueToParent();
                              //  this.getCollegeSubCat()
                              this.getExamForSubCat()
                              this.close();
                          }
                      });
                  } else {
                      Swal.fire('', res.response_message, 'error');
                  }
              });
          }
      
          deleteItem(index: number) {
              //    alert("sdfa")
              let docType = index;
      
              //    alert( "docType id = "+docType+" college id = "+this.clgId)
      
              let examlist = [{
                  docType: docType,
                  examids: ""
              }];
      
              console.log({
                  collegeid: this.clgId,
                  examlist: examlist
              });
      
              this.campusService.saveExamForSubCat(this.clgId, examlist).subscribe((res) => {
                  if (res.response_message === "Success") {
                      this.updateLoader = false;
                      Swal.fire({
                          text: 'Entrance Exam Deleted successfully',
                          icon: 'success',
                          showCancelButton: false,
                          confirmButtonColor: "#3290d6 !important",
                          confirmButtonText: 'Ok'
                      }).then((result) => {
                          if (result.isConfirmed) {
                              // this.sendValueToParent();
                              //  this.getCollegeSubCat()
                              this.getExamForSubCat()
                          }
                      });
                  } else {
                      Swal.fire('', res.response_message, 'error');
                  }
              });
      
          }
      
          searchExams() {
              const searchValue = this.searchControl.value.toLowerCase();
      
              this.filteredExams = this.tmpfilteredExams;
              this.filteredExams = this.filteredExams.filter((exam) =>
                  exam.title.toLowerCase().includes(searchValue)
              )
          }
          getExamForSubCat() {
              const collegeid = this.collegeDetails.id;
              // this.campusService.getExamForSubCat(collegeid).subscribe((res) => {
              //     let responseData = res.response_data;
              //     this.staticData = res.response_data;
                  this.tblLoader = false;
              // });
          }
      
          getExamsList(examIndex: number, searchTerm: string) {
              // alert(examIndex)
      
      
      
              this.examindex = examIndex;
              //  alert("lll"+ this.examindex)
      
              //  this.subcatid =this.examindex
              // this.collegeid = this.collegeDetails.id;
              //  this.getexamdocsById(this.collegeid,this.subcatid);
      
              this.isLoading = true;
              // this.editLoader = true;
              const docType = examIndex;
              this.docType = examIndex
              this.campusService.getExams(searchTerm, docType).subscribe((res) => {
                  this.filteredExams = res.response_data;
                  this.tmpfilteredExams = res.response_data;
                  console.log("filtered Exam loaded")
                  this.isLoading = false;
                  // this.editLoader = false;
                  // alert("df")
              });
      
      
      
      
      
              this.selectTakeExam = [];
          }
      
      
      
          //     editItem(categoryid: string) {
          //         const dialogRef = this.dialog.open(this.callAPIDialog);
      
          //         const collegeid = this.collegeDetails.id;
          //         const subcatid = categoryid;
      
          //         this.campusService.getExamForCollege(collegeid, subcatid).subscribe(
          //             (res) => {
          //                 if (res.response_message === "Success") {
          //                     this.retriveUserData = res.response_data[0];
          //                     console.log("Retrieved data:", this.retriveUserData);
      
          //                      this.subcatExamForm.get('docType').setValue(this.retriveUserData.categoryid);
      
          // //if(this.retriveUserData.categoryid === this.ids ){
          //        const examIdsArray = this.retriveUserData.entrance_exams.split(',').map(id => id.trim());
          //         this.subcatExamForm.get('examids').setValue(examIdsArray);
          //         this.selectUpadteTakeExam = [];
          //           examIdsArray.forEach(examId => {
          //         const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
          //         if (selectedExam) {
          //             this.selectUpadteTakeExam.push(selectedExam);
          //         }
          //     });
          // //}
      
      
      
      
      
      
      
          //                 }
          //             }
          //         );
          //     }
      
      
      
          editItem(docId) {
              // console.log(docId)
              this.cdr.detectChanges()
              const dialogRef = this.dialog.open(this.callAPIDialog);
              //  localStorage.setItem('categoryid',categoryid);
      
              // this.collegeid = this.collegeDetails.id;
              // this.subcatid = categoryid;

              this.dialogDocArr = [];
              console.log(this.ExamDocList)
              this.dialogDocData = this.ExamDocList.filter((data)=> data.id == docId);
              console.log(this.dialogDocData)

              console.log(this.dialogDocData[0].docs_type)
              console.log(this.dialogDocData[0].docs_title)
            
              this.docId = this.dialogDocData[0].id;
              this.dialogdocsForm.get('docType').setValue(this.dialogDocData[0].docs_type)
              this.dialogdocsForm.get('title').setValue(this.dialogDocData[0].docs_title)

              this.dialogDocData[0].documents.forEach((data)=>{
                 this.dialogDocArr.push(data)
              })
              // this.dialogDocArr.push(this.dialogDocData[0].documents.split(','))
              
               console.log(this.dialogDocArr)

              if(this.dialogDocData[0].docs_type === 'Question_Paper' || this.dialogDocData[0].docs_type === 'Question Paper'){
                // alert(9)
                this.dialogdocsForm.get('docType').setValue('1')
              }else if(this.dialogDocArr[0].docs_type === 'Preparation'){
                this.dialogdocsForm.get('docType').setValue('2')
              }else{
                this.dialogdocsForm.get('docType').setValue('3')

              }
              this.editLoader = true;
              // this.getexamdocsById(docId)
          }
      
      
          getexamdocsById(docId) {
      
              this.editLoader = true;
      
              this.campusService.getExamDocById(docId).subscribe(
                  (res) => {
                      if (res.response_message === "Success") {
                          this.retriveUserData = res.response_data[0];
                          console.log("Retrieved data:", this.retriveUserData);
                          this.editLoader = false;
                          //  getExamsList();
                          // alert("pppp"+subcatid );
                          // alert("ggg"+this.retriveUserData.categoryid);
      
                          //const subcatid = localStorage.getItem('categoryid');
                          // alert("sss"+subcatid)
                          // alert("aaaa"+this.retriveUserData.categoryid)
                          // alert("hhhh"+subcatid)
                          //  if(this.retriveUserData.categoryid===subcatid){
                          this.subcatExamForm.get('docType').setValue(this.retriveUserData.categoryid);
      
                          // Split and map the entrance exams
                          // this.examindex=  this.examindex;
                          // alert("nnn"+ this.examindex)
                          // alert("ddd"+this.retriveUserData.categoryid)
                          // if( this.examindex==this.retriveUserData.categoryid){
                          //       alert(1111)
      
                          // }
                          const examIdsArray = this.retriveUserData.entrance_exams.split(',').map(id => id.trim());
                          this.subcatExamForm.get('examids').setValue(examIdsArray);
      
                          // Clear any previously selected exams
                          this.selectUpadteTakeExam = [];
      
                          // Match selected exams to the filtered exams list
                          examIdsArray.forEach(examId => {
                              const selectedExam = this.filteredExams.find(exam => exam.exams_id === examId);
                              if (selectedExam) {
                                  this.selectUpadteTakeExam.push(selectedExam);
      
                              }
                          });
                      }
      
      
                      // Set the selected category ID in the form
      
                  }
                  // }
              );
          }
      
          deleteexamdocsById(docId){
            Swal.fire({
                  title: 'Are you sure?',
                  text: 'You want to delete review details',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'Cancel'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.campusService.deleteexamdocsById(docId).subscribe((res) =>{
                      if(res.response_message == "Success"){
                        this.getExamDocs()
                        Swal.fire(
                          'Deleted!',
                          'Your document details has been deleted.',
                          'success'
                        );
                      }
                      else if(res.response_code=="300"){
                        Swal.fire({ icon: 'warning',text : res.response_message
                    }
                          );
                    }
                    });
                  } else {
                  }
            
              })
          }
      
          close() {
              this.dialog.closeAll();
              // this.subcatExamForm.reset();
              this.selectUpadteTakeExam = [];
              this.isLoading = false;
              this.filteredExams = [];
              this.searchControl1.reset();
      
          }
      
          // back() {
          //     this.sendValueToParent2();
          // }
      
          // sendValueToParent() {
          //     const valueToSend = "5";
          //     this.valueChanged.emit(valueToSend);
          // }
      
      
      
          // sendValueToParent2() {
          //     const valueToSend = "3";
          //     this.valueChanged.emit(valueToSend);
          // }
      
      
      
      
      
}   