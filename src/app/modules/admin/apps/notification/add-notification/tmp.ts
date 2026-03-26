import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray, FormControl } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { debounce } from 'lodash';
import { debounceTime } from 'rxjs/operators';


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
  // status: string;
  name: string;
  views: string;
}

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent implements OnInit {

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
  // status: Status[] = [
  //   { id: '1', name: 'Send' },
  //   { id: '0', name: 'Unsend' },
  // ];

  search_user = new FormControl();

  notificationForm: FormGroup;
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
  isAllSelected: Boolean = false;
  toggle:Boolean = true;
  filteredUsers:any[]

  collegeListData: College[];
  clgIds: string;
  collegeIds: any;
  collegeNames: any;
  id: any;
  selectedUsers: any[] = [];
  selectedStates: any[] = [];
  userListData: any;
  userIds: string;
  selectedUsers2: any;
  tmpUserArr: any;
  // id: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,) { }


  ngOnInit(): void {
    this.notificationForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      message: ['', [Validators.required]],
      // status: ['',[Validators.required]],
      userId: ['',Validators.required],
      certificationDocument_FrontFilePath: [''],
      certificationDocument_FrontFileType: '',
      certificationDocument_FrontFileName: '',
      search: [''],
      exam: [''],
      search_exam: '',
      search_user: '',
      search_state: '',
    })
    //this.getNotificationDetailsById()

    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.id) {
      // alert(routeParams.id);
      this.Loader = true
      // alert( this.Loader);
      this.id = routeParams.id;
      this.notificationForm.value.search
    }

    // this.getCategoryListByType()
    // this.getClgList()
    this.getUserList();
    this.getStateList();
    // this.getExams()

     this.search_user.valueChanges.pipe(debounceTime(300)).subscribe(value=>{
      this.filteredUsers = this.filterUsers(value);
     })
  }


  filterUsers(searchTerm:string):any[]{
    if(!searchTerm){
      return this.userListData;
    }else{
      return this.userListData.filter(item=> item.f_name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
  }

  ngAfterViewInit(): void {
    if ((this.id != '' && this.id != undefined)) {
      setTimeout(() => { this.getNotificationDetailsById(); }, 1000);
    }
  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  getCategoryListByType() {
    let type = "college"
    this.campusService.getCategoryListByType(type).subscribe((res) => {
      this.CategoryList = res.response_data

    })
  }

  updateType() {
    this.notificationForm.get('exam').setValue('')
  }

  getExams() {
    let search_exam = this.notificationForm.value.search_exam
    this.campusService.getExams(search_exam, '').subscribe((res) => {
      this.examList = res.response_data
    })
  }



  getClgList() {
    this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.notificationForm.value.search).subscribe((res) => {
      this.collegeListData = res.data;

    });
  }

  getUserList() {
    this.campusService.getUserforNotification(this.notificationForm.value.search_user).subscribe((res) => {
      this.userListData = res.response_data || []; // Ensure userListData is always an array
      this.filteredUsers = res.response_data || [];
    
    });
  }

  toggleSelectAll() {
    if (this.isAllSelected) {
      this.selectedUsers = []; // Clear selection
      console.log("in toggleSelectAll "+this.isAllSelected)
    } else {
      this.selectedUsers = [...this.userListData]; // Select all users
      console.log("in toggleSelectAll "+this.isAllSelected)
    }

    this.isAllSelected = this.selectedUsers.length === this.userListData.length; // Update state
    console.log("In toggleSelectAll "+this.isAllSelected)
    this.notificationForm.get('userId').setValue(this.selectedUsers); // Update form
  }

  isUserSelected(user) {
    return Array.isArray(this.selectedUsers) && this.selectedUsers.some((selectedUser) => selectedUser.id === user.id);
  }
  getStateList() {
        
  }

change(){
  this.toggle = !this.toggle;
  console.log(this.toggle)
}

  changeUsers(value) {
    this.selectedUsers2 = value;
    this.selectedUsers = value; // Ensure selectedUsers is an array
     console.log(this.selectedUsers)
    // Check if all users are selected
    // this.isAllSelected = this.selectedUsers.length === this.userListData.length;
    console.log("In changeUsers "+this.isAllSelected)
    // Update form control
    this.notificationForm.get('userId').setValue(this.selectedUsers);
  }

  changeStates(selectedStates) {
    this.selectedStates = selectedStates;
  }

  bindUserValues() {
     
     let userString = this.retriveData[0].userid;
     let users = userString.split(',');
   
     if(this.userListData !== undefined){
        users.forEach((item)=>{
           this.userListData.forEach((itemm)=>{
            if(item === itemm.id){
                this.selectedUsers.push(itemm);
            }
           })
        })
     }
    //  console.log(this.selectedUsers)
     this.notificationForm.get('userId').setValue(this.selectedUsers);
     this.tmpUserArr = this.selectedUsers
     console.log(this.tmpUserArr)
    // console.log(this.notificationForm.value.uesrId)
      
      // this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.notificationForm.value.search).subscribe((res) => {
      //   this.collegeListData = res.data;
      //   this.collegeIds.forEach((item) => {
      //     this.collegeListData.forEach((itemm) => {
      //       if (item == itemm.id) {
      //         this.selectedColleges.push(itemm);
      //         this.changeUsers;
      //         this.changeStates;
      //       }
      //     });
      //     //this.notificationForm.get('userId').setValue(this.selectedColleges);
      //     this.notificationForm.get('userId').setValue(this.selectedColleges);

      //     this.changeUsers(this.notificationForm.value.userId);
      //     this.changeStates(this.notificationForm.value.states);
      //   })
      // })
  }

  bindStateValues() {
    this.collegeNames.forEach((itemmm) => {
      console.log(itemmm)

      this.notificationForm.value.search = itemmm;

      this.campusService.getClgList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.notificationForm.value.search).subscribe((res) => {
        this.collegeListData = res.data;
        this.collegeIds.forEach((item) => {
          this.collegeListData.forEach((itemm) => {
            if (item == itemm.id) {
              this.selectedColleges.push(itemm);
              this.changeUsers;
              this.changeStates;
            }
          });
          //this.notificationForm.get('userId').setValue(this.selectedColleges);
          this.notificationForm.get('userId').setValue(this.selectedColleges);

          this.changeUsers(this.notificationForm.value.userId);
          this.changeStates(this.notificationForm.value.states);
        })
      })
    })
  }

  removeCollege(index: number, id: any) {
    if (id != null) {
      this.selectedColleges = this.selectedColleges.filter(item => item.id !== id);
      const collegeControl = this.notificationForm.get('college');
      if (collegeControl) {
        collegeControl.setValue(this.selectedColleges);
      }
    }
  }

  removeUsers(index: number, id: any) {
    this.selectedUsers = this.selectedUsers.filter((item) => item.id !== id);

    // Check if "Select All" should be unchecked
    this.isAllSelected = this.selectedUsers.length === this.userListData.length;

    // Update form control
    this.notificationForm.get('userId').setValue(this.selectedUsers);
  }

  getNotificationDetailsById() {
    this.updateButton = true
    this.campusService.getNotificationDetailsById(this.id).subscribe((res) => {
      //alert(this.id)
      if (res.response_message == "Success") {
        this.retriveData = res.response_data
        console.log(this.retriveData)

        // this.collegeIds = this.retriveData.college.split(',')
        // this.collegeNames = this.retriveData.collegename.split(',')


        // this.collegeIds = this.retriveData.college?.split(',') || [];
        // this.collegeNames = this.retriveData.collegename?.split(',') || [];




        this.notificationForm.get('name').setValue(this.retriveData[0]?.title)

        this.notificationForm.get('message').setValue(this.retriveData[0].message)
        // console.log(this.notificationForm.value.name+"  "+this.retriveData.title)
        // category type
        let userIds
        this.userListData.forEach((type) => {
          if (type.id == this.retriveData[0]?.userid) {
            userIds = type.id
          }
        });
        console.log(userIds)
        this.notificationForm.get('userId').setValue(userIds)

        //status
        // let Status
        // this.status.forEach((status) => {
        //   if (status.id == this.retriveData[0]?.status) {
        //     Status = status;
        //   }
        // });
        // console.log(Status)
        // this.notificationForm.get('status').setValue(Status)

        //.notificationForm.get('exam').setValue(this.retriveData?.exam_id)

        // this.notificationForm.get('certificationDocument_FrontFilePath').setValue(this.retriveData?.imagepath)
        // this.notificationForm.get('certificationDocument_FrontFileName').setValue(this.retriveData?.image)


        this.Loader = false



        this.bindUserValues();
        // this.bindStateValues();  


      }
    })
  }


  insertNotificationDetails() {
    if (this.notificationForm.status == "INVALID") {
      this.notificationForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {

      this.addLoader = true

      let categoryid = this.notificationForm.value.catType
      let name = this.notificationForm.value.name.charAt(0).toUpperCase() + this.notificationForm.value.name.slice(1)
      let image = this.notificationForm.value.certificationDocument_FrontFileName
      let message = this.notificationForm.value.message
      // let status = this.notificationForm.value.status.id
      let title = this.notificationForm.value.name;

      this.userIds = "";
      this.selectedUsers.forEach((item, index) => {
        const idAsNumber = Number(item.id);
        this.userIds += idAsNumber;
        if (index < this.selectedUsers.length - 1) {
          this.userIds += ",";
        }
      });

      let colleges = this.clgIds

      this.campusService.insertNotificationDetails(this.userIds, title, message).subscribe((res) => {
        if (res.response_message == "Success") {
          this.addLoader = false
          Swal.fire({
            text: 'New certification details added successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this._route.navigate(['apps/notification/notificationList']);
            }
          });
        } else {
          this.addLoader = false
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateNotificationDetails() {
    if (this.notificationForm.status == "INVALID") {
      this.notificationForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    } else {

      this.updateLoader = true

      let categoryid = this.notificationForm.value.catType
      // let name = this.notificationForm.value.name

      let name = this.notificationForm.value.name.charAt(0).toUpperCase() + this.notificationForm.value.name.slice(1)
      let image = this.notificationForm.value.certificationDocument_FrontFileName
      let message = this.notificationForm.value.message
      // let status = this.notificationForm.value.status.id
      let Exam = this.notificationForm.value.exam
      let title = this.notificationForm.value.name;

      this.userIds = "";
      this.selectedUsers.forEach((item, index) => {
        const idAsNumber = Number(item.id);
        this.userIds += idAsNumber;
        if (index < this.selectedUsers.length - 1) {
          this.userIds += ",";
        }
      });
      let college_id = this.userIds

      this.campusService.updateNotificationDetails(this.id, this.userIds, title, message).subscribe((res) => {
        if (res.response_message == "Success") {
          this.updateLoader = false
          Swal.fire({
            text: 'Notification details updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this._route.navigate(['apps/notification/notificationList']);
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
    this._route.navigate(['apps/notification/notificationList']);
  }

  onFileChange(event, docName, files: FileList) {
    this.Image = null
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    if (docName == 'certificationDocument') {
      this.showLoader = true;
    }
    this.campusService.certicationUploadDocs(formData).subscribe(res => {

      if (res.response_message == "success") {
        this.landing_img = res.File;
        this.uploaded_img = res.FileDir;
        let fileType = res.File.split(".");
        fileType = fileType[fileType.length - 1];
        fileType = fileType == "pdf" ? "PDF" : "IMG";
        let formArrayValue: any = this.notificationForm.value;
        formArrayValue[docName] = res.File;
        formArrayValue[docName + "FilePath"] = res.FileDir;
        this.tempDocumentArray2 = {
          file_name: docName,
          file_dir: res.FileDir,
          docName: res.File,
          DocumentExtn: "png",
        }
        console.log(this.tempDocumentArray2)
        if (docName == 'certificationDocument') {
          this.showLoader = false;
          this.notificationForm?.get('certificationDocument_FrontFilePath')?.setValue(res.FileDir);
          this.notificationForm?.get('certificationDocument_FrontFileType')?.setValue(fileType);
          this.notificationForm?.get('certificationDocument_FrontFileName')?.setValue(res.File);
        }

        if (this.tempDocumentArray2.file_name == 'certificationDocument') {
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
