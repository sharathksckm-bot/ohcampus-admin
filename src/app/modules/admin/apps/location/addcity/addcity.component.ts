import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addcity',
  templateUrl: './addcity.component.html',
  styleUrls: ['./addcity.component.scss']
})
export class AddcityComponent implements OnInit {

  cityForm : FormGroup; 
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  stateLoader : boolean = false;
  Loader : boolean = false;
  cityId: any;
  retriveData: any;
  countryListData: any;
  page: number = 1;
  pageSize: number = 10;
  columnIndex: number = 1;
  startNum: number = 1;
  sortValue: string = "asc";
  search: string = "";
  isChecked: any;
  stateListData: any;
  countryId: any;

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  tempDocumentArray2: { file_name: any; file_dir: any; cityName: any; DocumentExtn: string; };
  landing_img: any;
  uploaded_img: any;
  Image: null;
  uploaded_supporting_docs1: any;
  uploadDocs1: any;
  image: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.cityForm = this._formBuilder.group({
        country: ['',Validators.required],
        state: ['',Validators.required],
        city: ['',[Validators.required,Validators.minLength(3), Validators.maxLength(150),]],
        menu: [0,Validators.required],
        cityDocument_FrontFilePath : [''],
      cityDocument_FrontFileType:'',
      cityDocument_FrontFileName:'' ,
      })
  
    const routeParams = this._activatedroute.snapshot.params;
    this.getStateList();
    if (routeParams.cityId) {
      this.Loader = true
      this.cityId = routeParams.cityId;
    }

    this.getCountryList()
  }


  getStateList(){
    this.campusService.getCityFormStateList().subscribe((res)=>{
      this.stateListData = res.response_data;
      console.log(this.stateListData)
    })
  }
  updateTopMenuValue(event: any) {
    this.isChecked = event?.checked;
    this.cityForm.get('menu').setValue(this.isChecked ? 1 : 0);
  }
  
  ngAfterViewInit(): void {
    if ((this.cityId != '' && this.cityId != undefined)) {
      setTimeout(() => { this.getCityDetailsById(); }, 1000);
    }
  }

  getCountryList(){
    this.campusService.getCountryList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
      this.countryListData = res.data;
    });
  }

  getStateDetailsByCntId(){
    this.countryId = this.cityForm.value.country
    if(this.countryId == ''){
      this.countryId = this.retriveData?.countryid
    }
    this.stateLoader = true
    this.campusService.getStateDetailsByCntId(this.countryId).subscribe((res) =>{
    this.stateListData = res.response_data;
    this.stateLoader = false
  
     //state
     let state
     this.stateListData.forEach((item) => {
       if (item.id == this.retriveData?.stateid) {
         state = item.id;
       }
     });
     this.cityForm.get('state').setValue(state)
    });
  }

 
  
  getCityDetailsById(){
    this.updateButton = true  
    this.campusService.getCityDetailsById(this.cityId).subscribe((res) =>{
      if(res.response_message == "Success") { 
      this.retriveData = res.response_data

     //country
    let cntry;
    this.countryListData.forEach((item) => {
    if (item.id == this.retriveData?.countryid) {
      cntry = item.id;
    }
    });
    this.cityForm.get('country').setValue(cntry);

    //state
    // this.getStateDetailsByCntId();
      
    this.cityForm.get('city').setValue(this.retriveData?.city)

    if(this.retriveData?.view_in_menu == 1){
      this.cityForm.get('menu').setValue(1)
    }else{
      this.cityForm.get('menu').setValue(0)
    }
    
  
    // this.stateListData.map((data)=>{
    //   if(data.stateid == this.retriveData?.stateid){
    //     this.cityForm.get('state').setValue(data.statename);
    //   }
    // })
    this.cityForm.get('state').setValue(this.retriveData?.stateid)
    this.cityForm.get('cityDocument_FrontFilePath').setValue(this.retriveData?.image)
    // this.cityForm.get('cityDocument_FrontFileName').setValue(this.retriveData?.image)


    this.Loader = false

      }
    })
  }

 

  insertCityDetails(){
    if(this.cityForm.status == "INVALID"){
      this.cityForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
  
    this.addLoader = true
    let countryId = this.cityForm.value.country
    let stateid = this.cityForm.value.state
    let city = this.cityForm.value.city.charAt(0).toUpperCase() + this.cityForm.value.city.slice(1)
    let menu =  this.cityForm.value.menu
    let image = this.cityForm.value.cityDocument_FrontFileName;


    this.campusService.insertCityDetails(city,countryId,stateid,menu,image).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.addLoader = false  
      Swal.fire({
        text:  'New city added successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/location/city']);
        } 
      });
      }else{
        this.addLoader = false 
        Swal.fire('', res.response_message, 'error');
      }
    })
  }
  }

  updateCityDetails(){
    if(this.cityForm.status == "INVALID"){
      this.cityForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
  
    this.addLoader = true
    let countryId = this.cityForm.value.country
    let stateid = this.cityForm.value.state
    let city = this.cityForm.value.city.charAt(0).toUpperCase() + this.cityForm.value.city.slice(1)
    let menu =  this.cityForm.value.menu
    let image = this.cityForm.value.cityDocument_FrontFileName;

    this.campusService.updateCityDetails(this.cityId,city,countryId,stateid,menu,image).subscribe((res) =>{
      if(res.response_message == "Success") {                                
      this.addLoader = false  
      Swal.fire({
        text:  'City updated successful',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#3290d6 !important",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this._route.navigate(['apps/location/city']); 
        } 
      });
      }else{
        this.addLoader = false 
        Swal.fire('', res.response_message, 'error');
      }
    })
  }
  }

  back(){
    this._route.navigate(['apps/location/city']);
  }

   onFileChange(event, cityName, files: FileList) {
      this.Image = null
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      if (cityName == 'cityDocument') {
        this.showLoader = true;
      }
      console.log(event.target.files[0])
      this.campusService.cityUploadDocs(formData).subscribe(res => {
  
      if(res.response_message == "success"){
        this.landing_img = res.File;
        this.uploaded_img = res.FileDir;
        
        let fileType = res.File.split(".");
        
        fileType = fileType[fileType.length - 1];
        fileType = fileType == "pdf" ? "PDF" : "IMG";
        let formArrayValue: any = this.cityForm.value;
        console.log(formArrayValue)
        formArrayValue[cityName] = res.File;
        formArrayValue[cityName + "FilePath"] = res.FileDir;
        this.tempDocumentArray2 = {
          file_name: cityName,
          file_dir: res.FileDir,
          cityName: res.File,
          DocumentExtn: "png",
        }
        console.log(this.tempDocumentArray2 )
        if (cityName == 'cityDocument') {
          this.showLoader = false;
          this.cityForm?.get('cityDocument_FrontFilePath')?.setValue(res.FileDir);
          this.cityForm?.get('cityDocument_FrontFileType')?.setValue(fileType);
          this.cityForm?.get('cityDocument_FrontFileName')?.setValue(res.File);
        }
  
        if (this.tempDocumentArray2.file_name == 'cityDocument') {
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
