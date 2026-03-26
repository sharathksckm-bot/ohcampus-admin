import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

interface Course {
  id: string;
  name: string;
}

@Component({
  selector: 'app-addcourse',
  templateUrl: './addcourse.component.html',
  styleUrls: ['./addcourse.component.scss']
})
export class AddcourseComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild('scopeTextarea') scopeTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('jobProfileTextarea') jobProfileTextarea!: ElementRef<HTMLTextAreaElement>
  @ViewChild('certificationTextarea') certificationTextarea!: ElementRef<HTMLTextAreaElement>



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
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
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

  courseForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  subLoader : boolean = false;
  Loader : boolean = false;
  courseId: any;
  coueseDetails: any;
  courseList: any;
  courseData: any;
  Image: any;
  landing_img: any;
  uploaded_img: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  image : any;
  ImageName: any;
  subCourseList: any;
  isChecked: any;
  isInitialBulletAdded: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router) { }

    ngOnInit(): void {
      this.courseForm = this._formBuilder.group({
        name: ['',[Validators.required]],
        duration : ['',[Validators.required]],
        coursecategory : ['',Validators.required],
        category : ['',Validators.required],
        subcategory : ['',Validators.required],
        keyword: [''],
        scope : [''],
        jobprofile : [''],
        eligibility : [''],
        certification : [''],
        description : [''],
        topmenu : [''],
        courseDocument_FrontFilePath : [''],
        courseDocument_FrontFileType:'',
        courseDocument_FrontFileName:'',

  })


  const routeParams = this._activatedroute.snapshot.params;
  if (routeParams.courseId) {
  this.Loader = true
  this.updateButton = true
  this.courseId = routeParams.courseId;
  }

  this.getAcCategoryForCourse();
  this.getCategoryForCourse();

}

ngAfterViewInit(): void {
  if ((this.courseId != '' && this.courseId != undefined)) {
    setTimeout(() => { this.getCourseDetailsById(); }, 1500);
  }
}


checkValidInputData(event: any, type) {
  this.globalService.checkValidInputData(event, type);
}

getAcCategoryForCourse(){
  this.campusService.getAcCategoryForCourse().subscribe((res) =>{
    this.courseList = res.response_data

  })
}

getCategoryForCourse(){
  this.campusService.getCategoryForCourse().subscribe((res) =>{
    this.courseData = res.response_data
  })
}

deleteDoc(){
  this.courseForm.get('courseDocument_FrontFilePath').setValue('')
  this.courseForm.get('courseDocument_FrontFileName').setValue('')
  this.courseForm.get('courseDocument_FrontFileType').setValue('')
}

getSubCategoryByCatId(){
  let catId = this.courseForm.value.category
  let acCatId = this.courseForm.value.coursecategory
  if(catId != '' && acCatId != '' ){
    this.subLoader = true
  this.campusService.getSubCategoryByCatId(catId,acCatId).subscribe((res) =>{
    if(res.response_message == "Success"){
    this.subCourseList = res.response_data
    this.subLoader = false

    let subcategory
    this.subCourseList.forEach((item) => {
      if(item.id == this.coueseDetails.sub_category){
        subcategory = item.id
      }
    });
    this.courseForm.get('subcategory').setValue(subcategory)
  }else{
    this.subLoader = false
  }
  })
}

}

getCourseDetailsById(){
  this.campusService.getCourseDetailsById(this.courseId).subscribe((res) =>{
  if(res.response_message == "Success"){
  this.coueseDetails = res.response_data[0]
  this.courseForm.get('name').setValue(this.coueseDetails.name)
  this.courseForm.get('duration').setValue(this.coueseDetails.duration)
  this.courseForm.get('scope').setValue(this.coueseDetails.scope)
  this.courseForm.get('jobprofile').setValue(this.coueseDetails.job_profile)
  this.courseForm.get('certification').setValue(this.coueseDetails.certification)
  this.courseForm.get('description').setValue(this.coueseDetails.course_description)
   this.courseForm.get('eligibility').setValue(this.coueseDetails.eligibility)
  this.courseForm.get('keyword').setValue(this.coueseDetails.keyword)
  if(this.coueseDetails?.view_in_menu == 1){
    this.courseForm.get('topmenu').setValue(1)
  }else{
    this.courseForm.get('topmenu').setValue(0)
  }

  let courseCategory
  this.courseList.forEach((item) => {
    if(item.category_id == this.coueseDetails.academic_category){
      courseCategory = item.category_id
    }
  });
  this.courseForm.get('coursecategory').setValue(courseCategory)

  let category
  this.courseData.forEach((item) => {
    if(item.id == this.coueseDetails.course_category){
      category = item.id
    }
  });
  this.courseForm.get('category').setValue(category)
  this.getSubCategoryByCatId()

  this.courseForm.get('courseDocument_FrontFilePath').setValue(this.coueseDetails.filepath)
  this.courseForm.get('courseDocument_FrontFileName').setValue(this.coueseDetails.image)


  this.Loader = false
  }else{
    this.Loader = false
  }
  })
}

insertCourseDetails(){
  if(this.courseForm.status == "INVALID"){
    this.courseForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
  this.addLoader = true
  let name = this.courseForm.value.name.charAt(0).toUpperCase() + this.courseForm.value.name.slice(1)
  let duration = this.courseForm.value.duration
  let academicCategory = this.courseForm.value.coursecategory
  let courseCategory = this.courseForm.value.category
  let scope = this.courseForm.value.scope
  let jobProfile = this.courseForm.value.jobprofile
   let eligibility = this.courseForm.value.eligibility
  let certification = this.courseForm.value.certification
  let description = this.courseForm.value.description
  this.ImageName = this.courseForm.value.courseDocument_FrontFileName
  let sub_category = this.courseForm.value.subcategory
  let keyword =this.courseForm.value.keyword
  let topmenu =this.courseForm.value.topmenu

  this.campusService.insertCourseDetails( name,duration,academicCategory,courseCategory,scope,jobProfile, eligibility,certification,description,this.ImageName,sub_category,topmenu).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.addLoader = false
      Swal.fire({
        text:  'New course details added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/course/viewcourse']);
        }
      });
    }else{
      this.addLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })
}
}

addInitialBullet(taName:String): void {
  
  if(taName == 'scope'){
  if (!this.isInitialBulletAdded && this.scopeTextarea.nativeElement.value.trim() === '') {
    // Add the initial bullet if the textarea is empty
    this.scopeTextarea.nativeElement.value = '• ';
    this.isInitialBulletAdded = true;

    // Set the cursor position after the bullet
    const cursorPosition = this.scopeTextarea.nativeElement.value.length;
    this.scopeTextarea.nativeElement.selectionStart = cursorPosition;
    this.scopeTextarea.nativeElement.selectionEnd = cursorPosition;
    // this.isInitialBulletAdded = false;

  }
}else if(taName == 'jobProfile'){
  if(!this.isInitialBulletAdded && this.jobProfileTextarea.nativeElement.value.trim() === ''){
    this.jobProfileTextarea.nativeElement.value = '• ';
    this.isInitialBulletAdded = true;

    const cursorPosition = this.jobProfileTextarea.nativeElement.value.length;
    this.scopeTextarea.nativeElement.selectionStart = cursorPosition;
    this.scopeTextarea.nativeElement.selectionEnd = cursorPosition;
}
}else if(taName == 'certification'){
    if(!this.isInitialBulletAdded && this.certificationTextarea.nativeElement.value.trim() === ''){
      
      this.certificationTextarea.nativeElement.value = '• ';
      this.isInitialBulletAdded = true;

      const cursorPosition = this.certificationTextarea.nativeElement.value.length;
      this.certificationTextarea.nativeElement.selectionStart = cursorPosition;
      this.certificationTextarea.nativeElement.selectionEnd = cursorPosition;
    }
}
}


addBullet(event: KeyboardEvent): void {
  const textarea = event.target as HTMLTextAreaElement;

  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default Enter behavior

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert a new bullet point
    const value = textarea.value;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(end);

    textarea.value = `${beforeCursor}\n• ${afterCursor}`;
    textarea.selectionStart = textarea.selectionEnd = start + 3; // Adjust cursor position
  }
}

onFocusOut(){
    this.isInitialBulletAdded = false;
}


updateCourseDetails(){
  console.log(this,this.courseForm.value)
  if(this.courseForm.status == "INVALID"){
    this.courseForm.markAllAsTouched();
    Swal.fire('', 'Please fill all mandatory data', 'error')
      return
   }else{
    this.updateLoader = true
    let name = this.courseForm.value.name.charAt(0).toUpperCase() + this.courseForm.value.name.slice(1)
    let duration = this.courseForm.value.duration
    let academicCategory = this.courseForm.value.coursecategory
    let courseCategory = this.courseForm.value.category
    let scope = this.courseForm.value.scope
    let jobProfile = this.courseForm.value.jobprofile
     let eligibility = this.courseForm.value.eligibility
    let certification = this.courseForm.value.certification
    let description = this.courseForm.value.description
    this.ImageName = this.courseForm.value.courseDocument_FrontFileName
    let sub_category = this.courseForm.value.subcategory
    let topmenu = this.courseForm.value.topmenu

  this.campusService.updateCourseDetails( this.courseId, name,duration,academicCategory,courseCategory,scope,jobProfile,eligibility,certification,description,this.ImageName,sub_category,topmenu).subscribe((res) =>{
    if(res.response_message == "Success"){
      this.updateLoader = false
      Swal.fire({
        text:  'Course details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/course/viewcourse']);
        }
      });
    }else{
      this.updateLoader = false
      Swal.fire('', res.response_message , 'error')
    }
  })
}
}


onFileChange2(event, docName, files: FileList) {
  this.Image = null
  const formData = new FormData();
  formData.append('file', event.target.files[0]);
  if (docName == 'courseDocument') {
    this.showLoader = true;
  }
  this.campusService.uploadCourseDocs(formData).subscribe(res => {

  if(res.response_message == "success"){
    this.landing_img = res.File;
    this.uploaded_img = res.FileDir;
    let fileType = res.File.split(".");
    fileType = fileType[fileType.length - 1];
    fileType = fileType == "pdf" ? "PDF" : "IMG";
    let formArrayValue: any = this.courseForm.value;
    formArrayValue[docName] = res.File;
    formArrayValue[docName + "FilePath"] = res.FileDir;
    this.tempDocumentArray2 = {
      file_name: docName,
      file_dir: res.FileDir,
      docName: res.File,
      DocumentExtn: "png",
    }
    if (docName == 'courseDocument') {
      this.showLoader = false;
      this.courseForm?.get('courseDocument_FrontFilePath')?.setValue(res.FileDir);
      this.courseForm?.get('courseDocument_FrontFileType')?.setValue(fileType);
      this.courseForm?.get('courseDocument_FrontFileName')?.setValue(res.File);
    }

    if (this.tempDocumentArray2.file_name == 'courseDocument') {
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
  this._route.navigate(['apps/course/viewcourse']);
}

updateTopMenuValue(event: any) {
    this.isChecked = event.checked;
    this.courseForm.get('topmenu').setValue(this.isChecked ? 1 : 0);
  }
}
