import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray, FormControl } from '@angular/forms';
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
  selector: 'app-addblog',
  templateUrl: './addblog.component.html',
  styleUrls: ['./addblog.component.scss']
})
export class AddblogComponent implements OnInit {
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
  blogForm: FormGroup;
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
  blogTypslist: any;
  image: any;
  Image: any;
  landing_img: any;
  uploaded_img: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  CategoryList: any;
  blogId: any;
  updateImage: any;
  page: number = 1;
  pageSize: number = 10;
  startNum: number = 1;
  sortValue: string = "desc";
  columnIndex: number = 0;
  selectedColleges: any = [];
  selectedColleges2: any[] = [];
  examList: any;

  collegeListData: College[];
  clgIds: string;
  collegeIds: any;
  collegeNames: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,) { }


  ngOnInit(): void {
    this.blogForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      subTitle: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(50)]],
      catType: ['', Validators.required],
      description: ['', [Validators.required]],
      status: ['', Validators.required],
      collegeid: [''],
      blogDocument_FrontFilePath: [''],
      blogDocument_FrontFileType: '',
      blogDocument_FrontFileName: '',
      search: [''],
      exam: [''],
      search_exam: ''
    })

    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.blogId) {

      this.Loader = true
      this.blogId = routeParams.blogId;
      // alert( this.blogId)
      this.blogForm.value.search
    }

    this.getBlogcategoryList()
    this.getClgList()
    this.getExams()
  }

  ngAfterViewInit(): void {
    if ((this.blogId != '' && this.blogId != undefined)) {
      this.updateButton = true;
      setTimeout(() => { this.getBlogDetailsById(); }, 1000);
    }
  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getBlogcategoryList() {
    this.campusService.getBlogCategory().subscribe((res) => {
      this.CategoryList = res.response_data

    })
  }

  updateType() {
    this.blogForm.get('exam').setValue('')
  }

  getExams() {
    let search_exam = this.blogForm.value.search_exam
    this.campusService.getExams(search_exam, '').subscribe((res) => {
      this.examList = res.response_data
    })
  }



  getClgList() {
    this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.blogForm.value.search).subscribe((res) => {
      this.collegeListData = res.data;
       console.log(this.collegeListData)
    });
  }

  changeColleges(selectedclgs) {
    this.selectedColleges = selectedclgs;
  }

  bindCollegeValues() {
    this.collegeNames.forEach((itemmm) => {
      this.blogForm.value.search = itemmm;

      this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.blogForm.value.search).subscribe((res) => {
        this.collegeListData = res.data;
        this.collegeIds.forEach((item) => {
          this.collegeListData.forEach((itemm) => {
            if (item == itemm.id) {
              this.selectedColleges.push(itemm);
              
            }
          });
          this.blogForm.get('collegeid').setValue(this.selectedColleges);
          // console.log(this.selectedColleges)
          this.changeColleges(this.blogForm.value.collegeid);
        })
      })
    })
  }

  removeCollege(index: number, id: any) {
    if (id != null) {
      this.selectedColleges = this.selectedColleges.filter(item => item.id !== id);
      const collegeControl = this.blogForm.get('collegeid');
      if (collegeControl) {
        collegeControl.setValue(this.selectedColleges);
      }
    }
  }

  getBlogDetailsById() {
    // this.updateButton = true
    this.campusService.getBlogDetailsById(this.blogId).subscribe((res) => {
      //alert(this.blogId)
      if (res.response_message == "Success") {
        this.retriveData = res.response_data

        if (this.retriveData.exam_name != '') {

          this.blogForm.value.search_exam = this.retriveData.exam_name

          this.getExams()

          setTimeout(() => {
            let examName
            this.examList.forEach((item) => {
              if (item.exams_id == this.retriveData.exam_id) {
                examName = item.exams_id
              }
            });
            this.blogForm.get('exam').setValue(examName)
          }, 1000)
        }


        if (this.retriveData.collegename != null) {
          this.collegeIds = this.retriveData.college_id.split(',')
          this.collegeNames = this.retriveData.collegename.split(',')

          this.bindCollegeValues()

        }


        this.blogForm.get('title').setValue(this.retriveData?.title)
        this.blogForm.get('subTitle').setValue(this.retriveData?.subtitle)
        this.blogForm.get('description').setValue(this.retriveData.description)

        //category type
        let catType
        this.CategoryList.forEach((type) => {
          if (type.id == this.retriveData?.categoryid) {
            catType = type.id
          }
        });
        this.blogForm.get('catType').setValue(catType)

        //status
        let Status
        this.status.forEach((status) => {
          if (status.id == this.retriveData?.t_status) {
            Status = status.id;
          }
        });
        this.blogForm.get('status').setValue(Status)
       
        this.blogForm.get('exam').setValue(this.retriveData?.exam_id)

        this.blogForm.get('blogDocument_FrontFilePath').setValue(this.retriveData?.imagepath)
        this.blogForm.get('blogDocument_FrontFileName').setValue(this.retriveData?.image)

        this.Loader = false
      }
    })
  }


  insertBlogDetails() {
    if (this.blogForm.status == "INVALID") {
      this.blogForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {
      if (this.blogForm.value.blogDocument_FrontFileName == '') {
        Swal.fire('', 'Please upload document', 'error')
        return
      }
      this.addLoader = true

      let categoryid = this.blogForm.value.catType
      let title = this.blogForm.value.title.charAt(0).toUpperCase() + this.blogForm.value.title.slice(1)
      let subTitle = this.blogForm.value.subTitle;
      let image = this.blogForm.value.blogDocument_FrontFileName
      let description = this.blogForm.value.description
      let status = this.blogForm.value.status
      let Exam = this.blogForm.value.exam

      this.clgIds = "";
      this.selectedColleges.forEach((item, index) => {
        const idAsNumber = Number(item.id);
        this.clgIds += idAsNumber;
        if (index < this.selectedColleges.length - 1) {
          this.clgIds += ",";
        }
      });

      let colleges = this.clgIds

      this.campusService.insertBlogDetails(categoryid, title,subTitle,image, description, status, Exam, colleges).subscribe((res) => {
        if (res.response_message == "Success") {
          this.addLoader = false
          Swal.fire({
            text: 'New article details added successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this._route.navigate(['apps/blog/viewblogs']);
            }
          });
        } else {
          this.addLoader = false
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateBlogDetails() {
    if (this.blogForm.status == "INVALID") {
      this.blogForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {
      if (this.blogForm.value.blogDocument_FrontFileName == '') {
        Swal.fire('', 'Please upload document', 'error')
        return
      }
      this.updateLoader = true

      let categoryid = this.blogForm.value.catType
      let title = this.blogForm.value.title.charAt(0).toUpperCase() + this.blogForm.value.title.slice(1)
      let subTitle = this.blogForm.value.subTitle;
      let image = this.blogForm.value.blogDocument_FrontFileName
      let description = this.blogForm.value.description
      let status = this.blogForm.value.status
      let Exam = this.blogForm.value.exam

      this.clgIds = "";
      this.selectedColleges.forEach((item, index) => {
        const idAsNumber = Number(item.id);
        this.clgIds += idAsNumber;
        if (index < this.selectedColleges.length - 1) {
          this.clgIds += ",";
        }
      });
      let colleges = this.clgIds

      this.campusService.updateBlogDetails(this.blogId, categoryid, title,subTitle, image, description, status, Exam, colleges).subscribe((res) => {
        if (res.response_message == "Success") {
          this.updateLoader = false
          Swal.fire({
            text: 'Article details updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this._route.navigate(['apps/blog/viewblogs']);
            }
          });
        } else {
          this.updateLoader = false
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  back() {
    this._route.navigate(['apps/blog/viewblogs']);
  }

  onFileChange(event, docName, files: FileList) {
    this.Image = null
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    if (docName == 'blogDocument') {
      this.showLoader = true;
    }
    this.campusService.BlogUploadDocs(formData).subscribe(res => {

      if (res.response_message == "success") {
        this.landing_img = res.File;
        this.uploaded_img = res.FileDir;
        let fileType = res.File.split(".");
        fileType = fileType[fileType.length - 1];
        fileType = fileType == "pdf" ? "PDF" : "IMG";
        let formArrayValue: any = this.blogForm.value;
        formArrayValue[docName] = res.File;
        formArrayValue[docName + "FilePath"] = res.FileDir;
        this.tempDocumentArray2 = {
          file_name: docName,
          file_dir: res.FileDir,
          docName: res.File,
          DocumentExtn: "png",
        }
        // console.log(this.tempDocumentArray2 )
        if (docName == 'blogDocument') {
          this.showLoader = false;
          this.blogForm?.get('blogDocument_FrontFilePath')?.setValue(res.FileDir);
          this.blogForm?.get('blogDocument_FrontFileType')?.setValue(fileType);
          this.blogForm?.get('blogDocument_FrontFileName')?.setValue(res.File);
        }

        if (this.tempDocumentArray2.file_name == 'blogDocument') {
          this.uploaded_supporting_docs1 = this.tempDocumentArray2.file_dir;
          this.uploadDocs1 = this.tempDocumentArray2.file_dir;
        }

        this.dialog.closeAll();
      } else {
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

