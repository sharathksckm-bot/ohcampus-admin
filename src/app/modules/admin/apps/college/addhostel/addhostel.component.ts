import { Component, OnInit, ViewChild, TemplateRef, Input, SimpleChanges, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray, FormControl } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { JsonPipe } from '@angular/common';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


interface Status {
  id: string;
  name: string;
}

interface College {
  checked: boolean;
  cityname: string;
  id: string;
  map_location: string;
  registraion_type: string;
  statename: string;
  status: string;
  title: string;
  views: string;
}

@Component({
  selector: 'app-addhostel',
  templateUrl: './addhostel.component.html',
  styleUrls: ['./addhostel.component.scss']
})
export class AddhostelComponent implements OnInit {

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
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
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

  


  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  
 

  status: Status[] = [
    { id: '1', name: 'Active' },
    { id: '0', name: 'Inactive' },
  ];
  hostelForm: FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader: boolean = false;
  updateButton: boolean = false;
  Loader: boolean = false;
  isChecked: any;
  countryListData: any;
  years: number[] = [];
  stateListData: any;
  retriveData: any;
  hostelTypslist: any;
  image: any;
  Image: any;
  landing_img: any;
  uploaded_img: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  CategoryList: any;
  hostelId: any;
  updateImage: any;
  page: number = 1;
  pageSize: number = 10;
  startNum: number = 1;
  sortValue: string = "desc";
  columnIndex: number = 0;
  selectedColleges: any = [];
  selectedColleges2: any[] = [];
  examList: any;

  htmlContent:string;
  collegeListData: College[];
  clgIds: string;
  collegeIds: any;
  collegeNames: any;
  clgId: any;
  path: string;

  descInputElement:HTMLInputElement;  
  hostelImages: any[];

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,) { }


  ngOnInit(): void {
    this.hostelForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      // catType : ['',Validators.required],
      description: ['', [Validators.required]],
      status: ['', Validators.required],
      collegeid: [''],
      hostelDocument_FrontFilePath: [''],
      hostelDocument_FrontFileType: '',
      hostelDocument_FrontFileName: '',
      search: [''],
      // exam: [''],
      search_exam: ''
    })

     
    const routeParams = this._activatedroute.snapshot.params;
    console.log(routeParams)
    console.log(this.config.uploadUrl)
    if (routeParams.hostelId) {

      this.Loader = true
      this.hostelId = routeParams.hostelId;
      // alert( this.hostelId)
      this.hostelForm.value.search
      // if ((this.hostelId != '' && this.hostelId != undefined)) {
      //   this.updateButton = true;
      //   setTimeout(() => { this.getHostelDetailsById(); }, 1000);
      // }
    }

    // this.getHostelcategoryList()
    this.getClgList()
    // this.getExams()
  }

  ngAfterViewInit(): void {
    if ((this.hostelId != '' && this.hostelId != undefined)) {
      this.updateButton = true;
      setTimeout(() => { this.getHostelDetailsById(); }, 1000);
    }
  
  }

 
  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  // getHostelcategoryList() {
  //   this.campusService.getBlogCategory().subscribe((res) => {
  //     this.CategoryList = res.response_data

  //   })
  // }

  updateType() {
    this.hostelForm.get('exam').setValue('')
  }

  getExams() {
    let search_exam = this.hostelForm.value.search_exam
    this.campusService.getExams(search_exam, '').subscribe((res) => {
      this.examList = res.response_data
    })
  }

  // uploadMultipleDocuments(event,docName){
  //    const formData = new FormData();
     
  //    this.showLoader = true;
  //    this.hostelImages = [];

  //    for(let i = 0; i<event.target.files.length;i++){
  //      formData.append('file',event.target.files[i]);
         

  //    this.campusService.HostelUploadDocs(formData).subscribe(res =>{
  //       if(res.response_message == "success"){
  //          this.landing_img = res.File;
  //          this.uploaded_img = res.FileDir;
  //          let formArrayValue: any = this.
  //         }
  //    })
  //   }
  // }

  getClgList() {
    this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.hostelForm.value.search).subscribe((res) => {
      this.collegeListData = res.data;
      console.log(this.collegeListData)
    });
  }

  changeColleges(selectedclgs) {
    // alert(selectedclgs)
    // this.clgIds = selectedclgs;
    this.clgId = selectedclgs;
  }

  bindCollegeValues() {
    this.collegeNames.forEach((itemmm) => {
      this.hostelForm.value.search = itemmm;

      this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.hostelForm.value.search).subscribe((res) => {
        this.collegeListData = res.data;
        this.collegeIds.forEach((item) => {
          this.collegeListData.forEach((itemm) => {
            if (item == itemm.id) {
              this.selectedColleges.push(itemm);
              this.changeColleges;
            }
          });
          this.hostelForm.get('collegeid').setValue(this.selectedColleges);
          this.changeColleges(this.hostelForm.value.collegeid);
        })
      })
    })
  }

  removeCollege(index: number, id: any) {
    if (id != null) {
      this.selectedColleges = this.selectedColleges.filter(item => item.id !== id);
      const collegeControl = this.hostelForm.get('collegeid');
      if (collegeControl) {
        collegeControl.setValue(this.selectedColleges);
      }
    }
  }

  getHostelDetailsById() {
    // this.updateButton = true

    //  alert(this.hostelId)
    this.campusService.getHostelDetailsById(this.hostelId).subscribe((res) => {
      //alert(this.hostelId)
      if (res.response_message == "Success") {
        
        console.log(res.response_data)
        this.retriveData = res.response_data

        // if (this.retriveData.exam_name != '') {

        //   this.hostelForm.value.search_exam = this.retriveData.exam_name

        //   this.getExams()

        //   setTimeout(() => {
        //     let examName
        //     this.examList.forEach((item) => {
        //       if (item.exams_id == this.retriveData.exam_id) {
        //         examName = item.exams_id
        //       }
        //     });
        //     this.hostelForm.get('exam').setValue(examName)
        //   }, 1000)
        // }


        // if (this.retriveData.collegename != null) {
        //   this.collegeIds = this.retriveData.college_id.split(',')
        //   this.collegeNames = this.retriveData.collegename.split(',')

        //   this.bindCollegeValues()

        // }


        console.log(this.retriveData)
        this.hostelForm.get('title').setValue(this.retriveData?.name)
         
        this.hostelForm.get('description').setValue(this.retriveData.description)
        this.htmlContent = this.retriveData.description;
        this.hostelForm.get('collegeid').setValue(this.retriveData.id)
        
        
        console.log(this.hostelForm.value.collegeid)
        this.clgId = this.retriveData.id;

        //category type
        // let catType
        // this.CategoryList.forEach((type) => {
        //   if (type.id == this.retriveData?.categoryid) {
        //     catType = type.id
        //   }
        // });
        // this.hostelForm.get('catType').setValue(catType)

        //status
        let Status
        this.status.forEach((status) => {
          if (status.id == this.retriveData?.status) {
            Status = status.id;
          }
        });
        this.hostelForm.get('status').setValue(Status)

        // this.hostelForm.get('exam').setValue(this.retriveData?.exam_id)

        this.hostelForm.get('hostelDocument_FrontFilePath').setValue(this.retriveData?.imagepath)
        this.hostelForm.get('hostelDocument_FrontFileName').setValue(this.retriveData?.image)

        this.Loader = false
      }
    })
  }


  insertHostelDetails() {
    console.log("sdfasf")

    if (this.hostelForm.status == "INVALID") {
       console.log("sdfasf")
      this.hostelForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {
      if (this.hostelForm.value.hostelDocument_FrontFileName == '') {
        Swal.fire('', 'Please upload document', 'error')
        return
      }
      this.addLoader = true

      // let categoryid = this.hostelForm.value.catType
      let title = this.hostelForm.value.title.charAt(0).toUpperCase() + this.hostelForm.value.title.slice(1)
      let images = this.hostelForm.value.hostelDocument_FrontFileName;
      let description = this.hostelForm.value.description
      let status = this.hostelForm.value.status
      let college = this.hostelForm.value.collegeid
      // let Exam = this.hostelForm.value.exam

      // this.clgIds = "";
      // this.selectedColleges.forEach((item, index) => {
      //   const idAsNumber = Number(item.id);
      //   this.clgIds += idAsNumber;
      //   if (index < this.selectedColleges.length - 1) {
      //     this.clgIds += ",";
      //   }
      // });


      let currentUser = JSON.parse(localStorage.getItem("currentUser"))
      let userId = currentUser.userId;
      let userType = currentUser.type;
      alert(college)
       
      this.campusService.insertHostelDetails(userId, userType, title, images, description, college, status).subscribe((res) => {
        if (res.response_message == "Success") {
          this.addLoader = false
          Swal.fire({
            text: 'New Hostel details added successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this._route.navigate(['apps/college/hostel']);
            }
          });
        } else {
          this.addLoader = false
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateHostelDetails() {
    if (this.hostelForm.status == "INVALID") {
      this.hostelForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {
      if (this.hostelForm.value.hostelDocument_FrontFileName == '') {
        Swal.fire('', 'Please upload document', 'error')
        return
      }
      this.updateLoader = true

      let categoryid = this.hostelForm.value.catType
      let title = this.hostelForm.value.title.charAt(0).toUpperCase() + this.hostelForm.value.title.slice(1)
      // let images = this.hostelImages
      let image = this.hostelForm.value.hostelDocument_FrontFileName
      let description = this.htmlContent
      let status = this.hostelForm.value.status
      let Exam = this.hostelForm.value.exam

      // this.clgIds = "";
      // this.selectedColleges.forEach((item, index) => {
      //   const idAsNumber = Number(item.id);
      //   this.clgIds += idAsNumber;
      //   if (index < this.selectedColleges.length - 1) {
      //     this.clgIds += ",";
      //   }
      // });
      let colleges = this.clgId;

      let currentUser = JSON.parse(localStorage.getItem("currentUser"));

      let userId = currentUser.userId;
      let userType = currentUser.type;

      // console.log(colleges)
      // alert(colleges+"  "+userId+"  "+userType)
      
      console.log(colleges)
      this.campusService.updateHostelDetails(this.hostelId, userId,userType, title, image, description, colleges,status).subscribe((res) => {
        if (res.response_message == "Success") {
          this.updateLoader = false
          Swal.fire({
            text: 'Hostel details updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this._route.navigate(['apps/college/hostel']);
            }
          });
        } else {
          this.updateLoader = false
          Swal.fire('', res.response_message, 'error');
        }
          
        
        
      })
    }
  }

  
  onImageUpload(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file); 
    console.log(file)
    // Upload the image to backend

    this.campusService.uploadDescImg(formData).subscribe((res)=>{
      console.log(res)
      if (res) {
        this.insertImage(res.FileDir); // Insert the URL into the editor
      }
    })
  }

  insertImage(url: string) {
     if(url &&(url.endsWith('.png') || url.endsWith('.jpeg') || url.endsWith('.jpg'))){
      this.htmlContent += `<img src="${url}" alt="Uploaded Image" height="300px" width="300px">`;
    }else{
      Swal.fire({
        text: 'Image Format not supported, please enter PNG/JPEG',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      })
         }
    // const editorImg = document.getElementById('editor');
    // this.htmlContent+=`<img src="${url}" alt="Uploaded Image" height="300px" width="300px">`;
    console.log(this.hostelForm.value.description)
  }

  // entered(event:Event){
  //   let innerText = event.target as HTMLInputElement;
  //   console.log(innerText)
  // }
  // @HostListener('window:selectionchange', ['$event'])
  // handleSelection() {
  //   console.log(123)
  //   const selection = window.getSelection();
  //   console.log(selection.toString())
  //   if (selection && selection.toString().length > 0) {
  //     console.log("Selected text:", selection.toString());
  //   }
  // }

  

  // selected(event:Event){
  //   console.log(123123)
  // }
  // keypress(event:KeyboardEvent){
  //     if(event.key === 'Backspace' || event.key ==='Delete'){
  //       console.log(2321)
  //        let editor =  document.getElementById('editor');
  //        console.log(this.htmlContent)
  //        editor.innerHTML = editor.innerHTML;
  //     }
  // }
     


  back() {
    this._route.navigate(['apps/college/hostel']);
  }

  onFileChange(event, docName, files: FileList) {
    this.Image = null;
    const formData = new FormData();
    if (docName == 'hostelDocument') {
      this.showLoader = true;
      this.hostelImages = [];
    }

    for(let i=0;i<event.target.files.length;i++){
      formData.append('file',event.target.files[i])
    
    
    
    this.campusService.HostelUploadDocs(formData).subscribe(res => {

      if (res.response_message == "success") {

        this.landing_img = res.File;
        this.uploaded_img = res.FileDir;
        let fileType = res.File.split(".");
        fileType = fileType[fileType.length - 1];
        fileType = fileType == "pdf" ? "PDF" : "IMG";
        let formArrayValue: any = this.hostelForm.value;
        formArrayValue[docName] = res.File;
        formArrayValue[docName + "FilePath"] = res.FileDir;
        this.tempDocumentArray2 = {
          file_name: docName,
          file_dir: res.FileDir,
          docName: res.File,
          DocumentExtn: "png",
        }
        console.log(this.tempDocumentArray2)
        if (docName == 'hostelDocument') {
          this.showLoader = false;
          this.hostelForm?.get('hostelDocument_FrontFilePath')?.setValue(res.FileDir);
          this.hostelForm?.get('hostelDocument_FrontFileType')?.setValue(fileType);
          this.hostelForm?.get('hostelDocument_FrontFileName')?.setValue(res.File);

          // this.hostelImages.push(this.tempDocumentArray2)
        }

        if (this.tempDocumentArray2.file_name == 'hostelDocument') {
          this.uploaded_supporting_docs1 = this.tempDocumentArray2.file_dir;
          this.uploadDocs1 = this.tempDocumentArray2.file_dir;
          this.showLoader = false;
        }

        this.dialog.closeAll();
      } else {
        this.showLoader = false;
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
  close() {
    this.dialog.closeAll();
  }


}
