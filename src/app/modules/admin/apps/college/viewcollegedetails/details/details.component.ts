import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
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

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;

  status: Status[] = [
    { id: '1', name: 'Active' },
    { id: '0', name: 'Inactive' },
  ];

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

  collegeForm: FormGroup;
  contactNum: FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader: boolean = false;
  updateButton: boolean = false;
  cityLoader: boolean = false;
  stateLoader: boolean = false;
  clgId: any;
  isChecked: any;
  page: number = 1;
  pageSize: number = 10;
  columnIndex: number = 0;
  startNum: number = 1;
  sortValue: string = "asc";
  search: string = "";
  countryListData: any;
  years: number[] = [];
  stateListData: any;
  collegeTypslist: any;
  cityListData: any;
  Loader: boolean = false;
  showAddButton: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService: CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router,) { }

  ngOnInit(): void {
    console.log(this.collegeDetails)
    this.collegeForm = this._formBuilder.group({
      collegeName: ['', [Validators.required]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      year: [''],
      address: ['', [Validators.required]],
      // mobileNumber:['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
      emailAddress: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      accreditation: [''],
      website: ['', [Validators.required]],
      maplocation: ['', [Validators.required]],
      clgType: ['', Validators.required],
      description: ['', Validators.required],
      regPkgType: [''],
      status: ['', Validators.required],
      // conditions : ['',[Validators.minLength(3)]],
      menu: [0],
      entranceTest: [0, Validators.required],
      what_new: [''],
      notificaton: [''],
      notificatonlink: [''],
      application_link: [''],
      is_trending: ['']
    })

    this.contactNum = this._formBuilder.group({
      contactNumber: this._formBuilder.array([]),
    });
    //alert(this.collegeDetails)
    // this.getClgDetailsById()

    this.addItem()
    this.getCountryList()
    this.generateYears()
    this.clgId = this.collegeDetails.id
    if ((this.clgId != null)) {
      this.Loader = true
    }
  }

  contactNumber(): FormArray {
    return this.contactNum.get("contactNumber") as FormArray;
  }

  multiContacts(): FormGroup {
    return this._formBuilder.group({
      mobileNumber: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
    });
  }

  addItem(): void {
    this.contactNumber().push(this.multiContacts());
    this.showAddButton = false
  }

  addMember() {
    if (this.contactNum.status == "VALID") {
      this.showAddButton = true
    } else {
      this.showAddButton = false
    }
  }

  removeItem(contactNumber, contactIndex) {
    let highlightId = contactNumber.value.id
    this.contactNumber().removeAt(contactIndex)
    this.showAddButton = true
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();

    console.log(currentYear)
    for (let year = currentYear; year >= currentYear - 224; year--) {
      this.years.push(year);
    }
  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  updateTopMenuValue(event: any) {
    this.isChecked = event?.checked;
    this.collegeForm.get('menu').setValue(this.isChecked ? 1 : 0);
  }

  getCountryList() {
    this.campusService.getCountryList(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.search).subscribe((res) => {
      this.countryListData = res.data;
      this.getCollegeTypes()
    });
  }

  packageUpadte(value) {
    if (this.collegeForm.value.regPkgType == 'free_listing') {
      this.collegeForm.get('notificaton').setValue('')
      this.collegeForm.get('notificatonlink').setValue('')
      this.collegeForm.get('application_link').setValue('')
    }
  }

  getCollegeTypes() {
    this.campusService.getCollegeTypes(this.page, this.pageSize, this.startNum, this.columnIndex, this.sortValue, this.search).subscribe((res) => {
      this.collegeTypslist = res.data
      this.getClgDetailsById()
    })
  }

  getStateDetailsByCntId() {
    let country = this.collegeForm.value.country
    this.stateLoader = true
    this.campusService.getStateDetailsByCntId(country).subscribe((res) => {
      this.stateListData = res.response_data;
      this.stateLoader = false

      //state
      let state
      this.stateListData.forEach((item) => {
        if (item.id == this.collegeDetails?.stateid) {
          state = item.id;
        }
      });
      this.collegeForm.get('state').setValue(state)
    });

    this.getCityDetailsByStateId()
  }

  getCityDetailsByStateId() {
    let stateId = this.collegeForm.value.state

    if (stateId == "") {
      stateId = this.collegeDetails?.stateid
    }
    this.cityLoader = true
    this.campusService.getCityDetailsByStateId(stateId).subscribe((res) => {

      if (res.response_message == "Success") {
        this.cityListData = res.response_data;

        //city
        let city
        this.cityListData.forEach((item) => {
          if (item.id == this.collegeDetails?.cityid) {
            city = item.id;
          }
        }
        );
        this.collegeForm.get('city').setValue(city)
      }
    });
    this.cityLoader = false

  }

  getClgDetailsById() {
    console.log(this.collegeDetails.status)
    if (this.collegeDetails.status == 1 || '0') {
      this.updateButton = true
      this.clgId = this.collegeDetails.id
      console.log(this.collegeDetails.status)

      //college name
      this.collegeForm.get('collegeName').setValue(this.collegeDetails.title)

      //country
      let cntry;
      this.countryListData.forEach((item) => {
        if (item.id == this.collegeDetails?.countryid) {
          cntry = item.id;
        }
      });
      this.collegeForm.get('country').setValue(cntry);
      
      //state
      this.getStateDetailsByCntId();

      //year
      let year
      this.years.forEach((item) => {
        if (item == this.collegeDetails.estd) {
          year = item;
        }
      });
      this.collegeForm.get('year').setValue(year)



      this.collegeDetails.phone.forEach((data, index) => {
        if (index != 0) {
          this.addItem();
        }
        this.contactNumber().controls[index].get('mobileNumber').setValue(data.mobileNumber)
      });

      this.addMember()

      // this.collegeForm.get('mobileNumber').setValue(this.collegeDetails.phone)
      this.collegeForm.get('emailAddress').setValue(this.collegeDetails.email)
      this.collegeForm.get('accreditation').setValue(this.collegeDetails.accreditation)
      this.collegeForm.get('website').setValue(this.collegeDetails.web)
      this.collegeForm.get('maplocation').setValue(this.collegeDetails.map_location)
      this.collegeForm.get('description').setValue(this.collegeDetails.description)
      this.collegeForm.get('address').setValue(this.collegeDetails.address)
      this.collegeForm.get('what_new').setValue(this.collegeDetails.what_new)
      this.collegeForm.get('notificaton').setValue(this.collegeDetails.notification)
      this.collegeForm.get('notificatonlink').setValue(this.collegeDetails.notification_link)
      this.collegeForm.get('application_link').setValue(this.collegeDetails.application_link)

      //college type
      let clgType
      this.collegeTypslist.forEach((type) => {
        if (type.id == this.collegeDetails.college_typeid) {
          clgType = type.id;
        }
      });
      this.collegeForm.get('clgType').setValue(clgType)

      //status
      // let Status
      // this.status.forEach((status) => {
      //   if (status.id == this.collegeDetails.status) {
      //     Status = status.id;
      //   }
      // });
      this.collegeForm.get('status').setValue(this.collegeDetails.status)

      //menu
      if (this.collegeDetails?.view_in_menu == 1) {
        this.collegeForm.get('menu').setValue(1)
      } else {
        this.collegeForm.get('menu').setValue(0)
      }

      //packege type
      if (this.collegeDetails?.package_type == "free_listing") {
        this.collegeForm.get('regPkgType').setValue("free_listing")
      } else {
        this.collegeForm.get('regPkgType').setValue("feature_listing")
      }

      //is_trending
      if (this.collegeDetails?.is_trending == "0") {
        this.collegeForm.get('is_trending').setValue("0")
      }
      else {
        this.collegeForm.get('is_trending').setValue("1")
      }

      //Entrance Test
      if (this.collegeDetails?.is_accept_entrance == "0") {
        this.collegeForm.get('entranceTest').setValue("0")
      }
      else if (this.collegeDetails?.is_accept_entrance == "1") {
        this.collegeForm.get('entranceTest').setValue("1")
      } else {
        this.collegeForm.get('entranceTest').setValue("2")
      }

      this.Loader = false
    } else {
      this.Loader = false
    }
  }

  insertClgDetails() {

  }

  updateClgDetails() {
    if (this.collegeForm.status == "INVALID") {
      this.collegeForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
      return
    }

    if (this.contactNum.status == "INVALID") {
      this.contactNum.markAllAsTouched();
      Swal.fire('', 'Please enter contact number or delete', 'error')
      return
    }

    if (this.collegeForm.value.regPkgType == "") {
      Swal.fire('', 'Please select registration package type', 'error')
      return
    }

    if (this.collegeForm.value.entranceTest == "") {
      Swal.fire('', 'Please select entrance test to link predictor', 'error')
      return
    }

    if (this.collegeForm.value.is_trending == "") {
      Swal.fire('', 'Please select is trending', 'error')
      return
    }

    this.updateLoader = true
    let collegeName = this.collegeForm.value.collegeName.charAt(0).toUpperCase() + this.collegeForm.value.collegeName.slice(1)
    let country = this.collegeForm.value.country
    let state = this.collegeForm.value.state
    let city = this.collegeForm.value.city
    let year = this.collegeForm.value.year
    let address = this.collegeForm.value.address
    let mobileNumber = this.contactNum.controls.contactNumber.value
    let emailAddress = this.collegeForm.value.emailAddress
    let accreditation = this.collegeForm.value.accreditation
    let website = this.collegeForm.value.website
    let maplocation = this.collegeForm.value.maplocation
    let rank = this.collegeForm.value.rank
    let clgType = this.collegeForm.value.clgType
    let description = this.collegeForm.value.description
    let regPkgType = this.collegeForm.value.regPkgType
    let status = this.collegeForm.value.status
    // let conditions = this.collegeForm.value.conditions
    let conditions = ''
    let menu = this.collegeForm.value.menu
    let entranceTest = this.collegeForm.value.entranceTest
    let what_new = this.collegeForm.value.what_new
    let notification = this.collegeForm.value.notificaton
    let notification_link = this.collegeForm.value.notificatonlink
    let application_link = this.collegeForm.value.application_link
    let is_trending = this.collegeForm.value.is_trending

    this.campusService.updateCollegeDetails(this.clgId, collegeName, country, state, mobileNumber, accreditation,
      maplocation, city, year, address, emailAddress, website, clgType, description, regPkgType,
      conditions, status, menu, entranceTest, what_new, notification, notification_link, application_link, is_trending).subscribe((res) => {
        if (res.response_message == "Success") {
          console.log(res)
          this.updateLoader = false
          Swal.fire({
            text: 'College details updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.sendValueToParent()
            }
          });
        } else {
          this.updateLoader = false
          Swal.fire('', res.response_message, 'error')
        }
      })

  }

  sendValueToParent() {
    const valueToSend = "1";
    this.valueChanged.emit(valueToSend);
  }

  back() {
    this._route.navigate(['apps/college/colleges']);
  }
}


