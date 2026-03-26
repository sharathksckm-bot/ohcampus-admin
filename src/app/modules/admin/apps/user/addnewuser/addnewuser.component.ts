import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-addnewuser',
  templateUrl: './addnewuser.component.html',
  styleUrls: ['./addnewuser.component.scss']
})
export class AddnewuserComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  newUser : FormGroup; 
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
  userStatusListData: any;
  userTypeListData: any;
  image : any;
  FirstName: any;
  LastName: any;
  PhoneNumber: any;
  Email: any;
  UserType: any;
  UserStatus: any;
  Password: any;
  ConfirmPassword: any;
  ImageName: any;
  userData: any;
  retriveUserData: any;
  userId: any;
  Image: any;
  hidePass: boolean = false
  page: number = 1;
  pageSize: number = 10;
  columnIndex: number = 1;
  startNum: number = 1;
  sortValue: string = "asc";
  search: string = "";

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    
    this.newUser = this._formBuilder.group({
        firstName: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
        lastName: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),Validators.pattern('^[a-zA-Z \-\']+')]],
        emailAddress:['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        mobileNumber:['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
        userType : ['',Validators.required],
        userStatus : ['',Validators.required],
        password : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.pattern(
                                             /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
                                          ),])],
        passwordConfirm : ['',Validators.required],
        userDocument_FrontFilePath : [''],
        userDocument_FrontFileType:'' ,
        userDocument_FrontFileName:''
     
  },
  {
    validators: FuseValidators.mustMatch('password', 'passwordConfirm')
  })

  this.userStatusList();
  this.userTypeList();
  
  const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.userId) {
    this.Loader = true
    this.userId = routeParams.userId;
  }
}
ngAfterViewInit(): void {
  if ((this.userId != '' && this.userId != undefined)) {
    this.hidePass = true
    setTimeout(() => { this.getUserDetailsById(); }, 1000);
  }
}

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  userStatusList(){
    this.campusService.userStatusList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
      this.userStatusListData = res.data
    })
  }

  userTypeList(){
    this.campusService.userTypeList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
      this.userTypeListData = res.data
    })
  }

  getUserDetailsById(){
  
    this.newUser.get('password')?.setValidators(null)
    this.newUser.get('password')?.updateValueAndValidity()
    this.newUser.get('passwordConfirm')?.setValidators(null)
    this.newUser.get('passwordConfirm')?.updateValueAndValidity()
    
    this.updateButton = true 
    let UserId = this.userId 
    this.campusService.getUserDetailsById(UserId).subscribe((res) =>{
      if(res.response_message == "Success") { 
      this.retriveUserData = res.response_data


      let usertype
      this.userTypeListData.forEach((type) => {
        if (type.id == this.retriveUserData?.user_type) {
          usertype = type.id;
        }
      });
      this.newUser.get('userType').setValue(usertype)

      let userstatus
      this.userStatusListData.forEach((status) => {
        if (status.id == this.retriveUserData?.user_status) {
          userstatus = status.id;
        }
      });
      this.newUser.get('userStatus').setValue(userstatus)

      
      this.newUser.get('firstName').setValue(this.retriveUserData?.f_name)
      this.newUser.get('lastName').setValue(this.retriveUserData?.l_name)
      this.newUser.get('emailAddress').setValue(this.retriveUserData?.email)
      this.newUser.get('mobileNumber').setValue(this.retriveUserData?.phone)
     
      this.Image = this.retriveUserData.image
      this.newUser.get('userDocument_FrontFilePath').setValue(this.retriveUserData.image)
      this.Loader = false
      }
    })

  }

addUser(){
    if(this.newUser.status == "INVALID"){
      
      this.newUser.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      if(this.newUser.value.userDocument_FrontFilePath==''){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
      console.log(this.newUser)
    this.addLoader = true
    this.FirstName = this.newUser.value.firstName.charAt(0).toUpperCase() + this.newUser.value.firstName.slice(1)
    this.LastName = this.newUser.value.lastName.charAt(0).toUpperCase() + this.newUser.value.lastName.slice(1)
    this.PhoneNumber = this.newUser.value.mobileNumber,
    this.Email = this.newUser.value.emailAddress,
    this.UserType = this.newUser.value.userType,
    this.UserStatus = this.newUser.value.userStatus,
    this.Password = this.newUser.value.password,
    this.ConfirmPassword = this.newUser.value.passwordConfirm,
    this.ImageName = this.newUser.value.userDocument_FrontFileName

    this.campusService.insertUserDetails(
                                         this.FirstName,this.LastName,
                                         this.PhoneNumber,this.Email,
                                         this.UserType,this.UserStatus,
                                         this.Password,this.ConfirmPassword,
                                         this.ImageName).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.addLoader = false  
      this.userData = res.response_data
      Swal.fire({
        text:  'New user added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/user/alluser']);
        } 
      });
      }else{
        this.addLoader = false 
        Swal.fire('', res.response_message, 'error');
      }
    })
  }
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
  this.FirstName = this.newUser.value.firstName.charAt(0).toUpperCase() + this.newUser.value.firstName.slice(1)
  this.LastName = this.newUser.value.lastName.charAt(0).toUpperCase() + this.newUser.value.lastName.slice(1)
  this.PhoneNumber = this.newUser.value.mobileNumber,
  this.Email = this.newUser.value.emailAddress,
  this.UserType = this.newUser.value.userType,
  this.UserStatus = this.newUser.value.userStatus,
  this.ImageName = this.newUser.value.userDocument_FrontFileName
  console.log(this.ImageName)

  this.campusService.updateUserDetails(this.retriveUserData?.id,
                                       this.FirstName,this.LastName,
                                       this.PhoneNumber,this.Email,
                                       this.UserType,this.UserStatus,
                                       this.ImageName).subscribe((res) =>{
    if(res.response_message == "Success") {                                
    this.updateLoader = false  
    this.userData = res.response_data
    Swal.fire({
      text:  'User details updated successful',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: "#3290d6 !important",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        this._route.navigate(['apps/user/alluser']);
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
  this._route.navigate(['apps/user/alluser']);
}



  onFileChange2(event, docName, files: FileList) {
    this.Image = null
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
        this.newUser?.get('userDocument_FrontFileName')?.setValue(res.File);
        this.newUser?.get('userDocument_FrontFileType')?.setValue(fileType);
      }
    
      if (this.tempDocumentArray2.file_name == 'userDocument') {
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