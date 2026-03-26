import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray, FormControl } from '@angular/forms';
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
  cityname:string;
  id:string;
  map_location:string;
  registraion_type:string;
  statename:string;
  status:string;
  name:string;
  views:string;
  }

@Component({
  selector: 'app-addcertification',
  templateUrl: './addcertification.component.html',
  styleUrls: ['./addcertification.component.scss']
})
export class AddcertificationComponent  implements OnInit {
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

    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    status: Status[] = [
      {id: '1', name: 'Active'},
      {id: '0', name: 'Inactive'},
    ];
    certificationForm : FormGroup;
    showLoader: boolean = false;
    addLoader: boolean = false;
    updateLoader : boolean = false;
    updateButton : boolean = false;
    Loader : boolean = false;
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
    startNum:  number = 1;
    sortValue: string = "desc";
    columnIndex: number = 0;
    selectedColleges:  any = [];
    selectedColleges2:  any[] = [];
    examList: any;

    collegeListData: College[];
    clgIds: string;
    collegeIds: any;
    collegeNames: any;
    id: any;
    // id: any;

    constructor(
      private _formBuilder: FormBuilder,
      private campusService : CampusService,
      public globalService: GlobalService,
      public dialog: MatDialog,
      public _activatedroute: ActivatedRoute,
      public _route: Router, ) { }


    ngOnInit(): void {
      this.certificationForm = this._formBuilder.group({
        name: ['',[Validators.required]],
        catType : ['',Validators.required],
        description : ['',[Validators.required]],
        status : ['',Validators.required],
        collegeid : [''],
        certificationDocument_FrontFilePath : [''],
        certificationDocument_FrontFileType:'',
        certificationDocument_FrontFileName:'' ,
        search : [''],
        exam: [''],
        search_exam:''
  })
  //this.getCertificateDetailsById()

        const routeParams = this._activatedroute.snapshot.params;
        if (routeParams.id) {
           // alert(routeParams.id);
          this.Loader = true
         // alert( this.Loader);
          this.id = routeParams.id;
          this.certificationForm.value.search
        }

     this.getCategoryListByType()
     this.getClgList()
     this.getExams()
    }

    ngAfterViewInit(): void {
    if ((this.id != '' && this.id != undefined)) {
      setTimeout(() => { this.getCertificateDetailsById(); }, 1000);
    }
  }

    checkValidInputData(event: any, type) {
      this.globalService.checkValidInputData(event, type);
    }

    getCategoryListByType(){
        let type = "college"
        this.campusService.getCategoryListByType(type).subscribe((res) =>{
          this.CategoryList = res.response_data

         })
      }

    updateType(){
     this.certificationForm.get('exam').setValue('')
    }

    getExams(){
      let search_exam = this.certificationForm.value.search_exam
      this.campusService.getExams(search_exam,'').subscribe((res) =>{
        this.examList = res.response_data
       })
    }



    getClgList(){
      this.campusService.getClgList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.certificationForm.value.search).subscribe((res) =>{
        this.collegeListData = res.data;
      });
    }

    changeColleges(selectedclgs) {
      this.selectedColleges = selectedclgs;
    }

    bindCollegeValues(){
      this.collegeNames.forEach((itemmm) => {
         console.log(itemmm)

        this.certificationForm.value.search = itemmm;

       this.campusService.getClgList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.certificationForm.value.search).subscribe((res) =>{
        this.collegeListData = res.data;
      this.collegeIds.forEach((item) => {
        this.collegeListData.forEach((itemm) => {
        if (item == itemm.id) {
          this.selectedColleges.push(itemm);
          this.changeColleges;
        }
      });
      //this.certificationForm.get('collegeid').setValue(this.selectedColleges);
      this.certificationForm.get('collegeid').setValue(this.selectedColleges);

      this.changeColleges(this.certificationForm.value.collegeid);
      })
      })
    })
    }

    removeCollege(index: number, id: any) {
      if (id != null) {
        this.selectedColleges = this.selectedColleges.filter(item => item.id !== id);
        const collegeControl = this.certificationForm.get('college');
        if (collegeControl) {
          collegeControl.setValue(this.selectedColleges);
        }
      }
  }

  getCertificateDetailsById(){
      this.updateButton = true
      this.campusService.getCertificateDetailsById(this.id).subscribe((res) =>{
        //alert(this.id)
        if(res.response_message == "Success") {
        this.retriveData = res.response_data


            // this.collegeIds = this.retriveData.college.split(',')
            // this.collegeNames = this.retriveData.collegename.split(',')


            this.collegeIds = this.retriveData.college?.split(',') || [];
            this.collegeNames = this.retriveData.collegename?.split(',') || [];




        this.certificationForm.get('name').setValue(this.retriveData?.name)

         this.certificationForm.get('description').setValue(this.retriveData.descritpion)

        //category type
        let catType
        this.CategoryList.forEach((type) => {
          if (type.id == this.retriveData?.category) {
            catType = type.id
            }
          });
          this.certificationForm.get('catType').setValue(catType)

         //status
        let Status
        this.status.forEach((status) => {
          if (status.id == this.retriveData?.status) {
            Status = status.id;
          }
        });
        this.certificationForm.get('status').setValue(Status)

        //.certificationForm.get('exam').setValue(this.retriveData?.exam_id)

        this.certificationForm.get('certificationDocument_FrontFilePath').setValue(this.retriveData?.imagepath)
        this.certificationForm.get('certificationDocument_FrontFileName').setValue(this.retriveData?.image)


        this.Loader = false



            this.bindCollegeValues()



        }
      })
    }


    insertCertificationDetails(){
      if(this.certificationForm.status == "INVALID"){
        this.certificationForm.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
        if(this.certificationForm.value.certificationDocument_FrontFileName ==''){
          Swal.fire('', 'Please upload document', 'error')
          return
        }
      this.addLoader = true

      let categoryid = this.certificationForm.value.catType
      let name = this.certificationForm.value.name.charAt(0).toUpperCase() + this.certificationForm.value.name.slice(1)
      let image = this.certificationForm.value.certificationDocument_FrontFileName
      let description = this.certificationForm.value.description
      let status = this.certificationForm.value.status

      this.clgIds = "";
      this.selectedColleges.forEach((item, index) => {
          const idAsNumber = Number(item.id);
          this.clgIds += idAsNumber;
          if (index < this.selectedColleges.length - 1) {
              this.clgIds += ",";
          }
      });

      let colleges = this.clgIds

      this.campusService.insertcertifiateDetails(categoryid,name,image,description,status,colleges).subscribe((res) =>{
        if(res.response_message == "Success") {
        this.addLoader = false
        Swal.fire({
          text:  'New certification details added successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/certification/certificationlist']);
          }
        });
        }else{
          this.addLoader = false
          Swal.fire('', res.response_message, 'error');
        }
      })
    }
  }

  updateCertificationDetails(){
    if(this.certificationForm.status == "INVALID"){
      this.certificationForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
      if(this.certificationForm.value.certificationDocument_FrontFileName ==''){
        Swal.fire('', 'Please upload document', 'error')
        return
      }
    this.updateLoader = true

      let categoryid = this.certificationForm.value.catType
      // let name = this.certificationForm.value.name

      let name = this.certificationForm.value.name.charAt(0).toUpperCase() + this.certificationForm.value.name.slice(1)
      let image = this.certificationForm.value.certificationDocument_FrontFileName
      let description = this.certificationForm.value.description
      let status = this.certificationForm.value.status
      let Exam = this.certificationForm.value.exam

      this.clgIds = "";
      this.selectedColleges.forEach((item, index) => {
          const idAsNumber = Number(item.id);
          this.clgIds += idAsNumber;
          if (index < this.selectedColleges.length - 1) {
              this.clgIds += ",";
          }
      });
      let college_id = this.clgIds

    this.campusService.updateCertificationDetails(categoryid,name,image,description,status,college_id,this.id).subscribe((res) =>{
      if(res.response_message == "Success") {
      this.updateLoader = false
      Swal.fire({
        text:  'Certification details updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
            this._route.navigate(['apps/certification/certificationlist']);
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
    this._route.navigate(['apps/certification/certificationlist']);
  }

    onFileChange(event, docName, files: FileList) {
      this.Image = null
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      if (docName == 'certificationDocument') {
        this.showLoader = true;
      }
      this.campusService.certicationUploadDocs(formData).subscribe(res => {

      if(res.response_message == "success"){
        this.landing_img = res.File;
        this.uploaded_img = res.FileDir;
        let fileType = res.File.split(".");
        fileType = fileType[fileType.length - 1];
        fileType = fileType == "pdf" ? "PDF" : "IMG";
        let formArrayValue: any = this.certificationForm.value;
        formArrayValue[docName] = res.File;
        formArrayValue[docName + "FilePath"] = res.FileDir;
        this.tempDocumentArray2 = {
          file_name: docName,
          file_dir: res.FileDir,
          docName: res.File,
          DocumentExtn: "png",
        }
        console.log(this.tempDocumentArray2 )
        if (docName == 'certificationDocument') {
          this.showLoader = false;
          this.certificationForm?.get('certificationDocument_FrontFilePath')?.setValue(res.FileDir);
          this.certificationForm?.get('certificationDocument_FrontFileType')?.setValue(fileType);
          this.certificationForm?.get('certificationDocument_FrontFileName')?.setValue(res.File);
        }

        if (this.tempDocumentArray2.file_name == 'certificationDocument') {
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

