
import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
})
export class ProfileComponent implements OnInit{
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('callAPIDialog1') callAPIDialog1: TemplateRef<any>;
    userData: any;
    newUser : FormGroup;
    page: number = 1;
    pageSize: number = 10;
    columnIndex: number = 1;
    startNum: number = 1;
    sortValue: string = "asc";
    search: string = "";
    userStatusListData: any;
  userTypeListData: any;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  edit : boolean = false;
  landing_img: any;
  uploaded_img: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  retriveUserData: any;
    image: any;
    usertype: any;
    userstatus: any;
    UserId: any;
    Image: any;

constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("currentUser"));
    this.UserId = this.userData.userId
    this.newUser = this._formBuilder.group({
        firstName: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
        lastName: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
        emailAddress:['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        mobileNumber:['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
        userType : ['',Validators.required],
        userStatus : ['',Validators.required],
        userDocument_FrontFilePath : [''],
        userDocument_FrontFileType:'' ,
        userDocument_FrontFileName:''

  })


  this.userTypeList();

}

checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
}

userTypeList(){
    this.campusService.userTypeList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
        this.userTypeListData = res.data
        //   setTimeout(() => {this.getUserDetailsById(); }, 1000);
        this.userStatusList();
    })
}

userStatusList(){
    this.campusService.userStatusList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
      this.userStatusListData = res.data
      this.getUserDetailsById();
    })
}


getUserDetailsById(){
    this.updateButton = true
    this.campusService.getUserDetailsById(this.UserId).subscribe((res) =>{
      if(res.response_message == "Success") {
      this.retriveUserData = res.response_data
      this.Image = this.retriveUserData.image

      this.newUser.get('firstName').setValue(this.retriveUserData?.f_name)
      this.newUser.get('lastName').setValue(this.retriveUserData?.l_name)
      this.newUser.get('emailAddress').setValue(this.retriveUserData?.email)
      this.newUser.get('mobileNumber').setValue(this.retriveUserData?.phone)

      let usertype
      this.userTypeListData.forEach((type) => {
        if (type.id == this.retriveUserData?.user_type) {
          usertype = type.id;
          this.usertype = type.name
        }
      });
      this.newUser.get('userType').setValue(usertype)

      let userstatus
      this.userStatusListData.forEach((status) => {
          if (status.id == this.retriveUserData?.user_status) {
              userstatus = status.id;
              this.userstatus = status.name
            }
        });
      this.newUser.get('userStatus').setValue(userstatus)

      this.newUser.get('userDocument_FrontFilePath').setValue(this.retriveUserData.image)

      this.Loader = true
      }
    })

  }

  updateUser(){
    if(this.newUser.status == "INVALID"){
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      if(this.newUser.value.userDocument_FrontFilePath == ''){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
this.updateLoader = true
  let FirstName = this.newUser.value.firstName.charAt(0).toUpperCase() + this.newUser.value.firstName.slice(1)
  let LastName = this.newUser.value.lastName.charAt(0).toUpperCase() + this.newUser.value.lastName.slice(1)
  let PhoneNumber = this.newUser.value.mobileNumber
  let Email = this.newUser.value.emailAddress
  let UserType = this.newUser.value.userType
  let UserStatus = this.newUser.value.userStatus
  let ImageName = this.newUser.value.userDocument_FrontFilePath

    this.campusService.updateUserDetails(this.retriveUserData?.id,
                                         FirstName,LastName,
                                         PhoneNumber,Email,
                                         UserType,UserStatus,
                                         ImageName).subscribe((res) =>{
      if(res.response_message == "Success") {
      this.updateLoader = false
      this.userData = res.response_data
      Swal.fire({
        text:  'Profile edited successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
            // this._route.navigate(['pages/profile']);
            this.getUserDetailsById()
            this.dialog.closeAll();
            this._route.navigate(['user1']);
            this._route.navigate(['/pages/profile']);
        }
      });
      }else{
        this.updateLoader = false
        Swal.fire('', res.response_message, 'error');
      }
    })
  }

}
onFileChange2(event, docName, files: FileList) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    if (docName == 'userDocument') {
      this.showLoader = true;
    }
    this.campusService.uploadUserDocs(formData).subscribe(res => {

    if(res.response_message == "success"){
      this.landing_img = res.File;
      this.uploaded_img = res.FileDir;
      let fileType = res.File.split(".");
      fileType = fileType[fileType.length - 1];
      fileType = fileType == "pdf" ? "PDF" : "IMG";
      let formArrayValue: any = this.newUser.value;
      formArrayValue[docName] = res.File;
      formArrayValue[docName + "FilePath"] = res.FileDir;
      this.tempDocumentArray2 = {
        file_name: docName,
        file_dir: res.FileDir,
        docName: res.File,
        DocumentExtn: "png",
      }
      if (docName == 'userDocument') {
        this.showLoader = false;
        this.newUser?.get('userDocument_FrontFilePath')?.setValue(res.FileDir);
        this.newUser?.get('userDocument_FrontFileType')?.setValue(fileType);
      }

      if (this.tempDocumentArray2.file_name == 'userDocument') {
        this.uploaded_supporting_docs1 = this.tempDocumentArray2.file_dir;
        this.uploadDocs1 = this.tempDocumentArray2.file_dir;
      }

    //   this.dialog.closeAll();

    }else{
      this.showLoader = false;
      Swal.fire('', res.response_message, 'error');
    }
    });
  }

editProfile() {
    this.edit = true
    this.getUserDetailsById()
    const dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe((result) => { });
}

openImgDialog(img) {
    const dialogRef = this.dialog.open(this.callAPIDialog1);
    dialogRef.afterClosed().subscribe((result) => { });
    this.image = img;
  }

close() {
    this.dialog.closeAll();
}

}
