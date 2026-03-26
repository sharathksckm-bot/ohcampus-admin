import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feestructure',
  templateUrl: './feestructure.component.html',
  styleUrls: ['./feestructure.component.scss']
})
export class FeestructureComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  @Input() Fee_structure: any;
  feeStructureForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  clgId: any;
  feeStructureIndex: any;
  showAddButton: boolean = false;
  feeId: any;
  courses: any = [];
  selectedColleges:  any = [];
  searchCrsValue: any;
  index: number;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.feeStructureForm = this._formBuilder.group({
      feeStructure: this._formBuilder.array([]),
    });

    this.addItem()
    this.clgId = this.collegeDetails.id
    if ((this.clgId != null)) {
      this.updateButton = true
      this.Loader = true
      this.index = 0
      this.getCourseUsingClgId(this.index);
      this.getFeeStructureDetails();
    }
    this.Loader = true
    setTimeout(() => {
        this.Loader = false
    }, 2000);

  }

  getCourseUsingClgId(index){
    console.log(index)
    this.searchCrsValue = this.feeStructure().controls[index].get('searchCrsValue').value ;


    this.campusService.getCourseUsingClgId(this.clgId,this.searchCrsValue).subscribe((res) =>{
    if(res.response_message == "Success"){
      let tmpArr = res.response_data
      this.courses = tmpArr.filter((data)=> data.name != null)
    }else{
      this.courses = {id : 0,
      name:"Course not found, please enter valid course name"}
    }
  })

  this.Loader = true


}

  getFeeStructureDetails(){
  if(this.clgId != null){
    this.updateButton = true
    this.Fee_structure.forEach((data,index) => {
    if(index!=0){
    this.addItem();
  }

    this.feeStructure().controls[index].get('id').setValue(data.id) ;
    this.feeStructure().controls[index].get('details').setValue(data.details) ;
    this.feeStructure().controls[index].get('amount').setValue(data.amount) ;
    this.feeStructure().controls[index].get('course_id').setValue(data.course_id) ;
    this.addMember(index)
  }
  );
  this.Loader = false
    }

  }

  checkValidInputData(event: any, type) {
    this.globalService.checkValidInputData(event, type);
  }

  feeStructure(): FormArray {
    return this.feeStructureForm.get("feeStructure") as FormArray;
  }

  multiStructures(): FormGroup {
    return this._formBuilder.group({
      id:'',
      details: [''],
      amount: [''],
      course_id: [''],
      searchCrsValue: '',
    });
  }

  addItem(): void {
    this.feeStructure().push(this.multiStructures());
    this.showAddButton = false
  }

  changeCourse(selectedcourse) {
    this.selectedColleges = selectedcourse;
  }

  addMember(feeStructureIndex){
    let details = this.feeStructure().controls[feeStructureIndex].get('details').value
    let amount = this.feeStructure().controls[feeStructureIndex].get('amount').value
    let course_id = this.feeStructure().controls[feeStructureIndex].get('course_id').value

   // console.log(details +'   '+amount +'   '+course_id +'   ')

    if(details != '' && amount != '' && course_id != ''){
      this.showAddButton = true
    } else{
      this.showAddButton = false
    }

  }

  removeItem(feeStructureData,feeStructureIndex) {
    this.feeId = feeStructureData.value.id
    this.feeStructureIndex = feeStructureIndex;
    this.feeStructure().removeAt(feeStructureIndex)
    this.campusService.deleteFeeStructOfCollege(this.feeId).subscribe((res) =>{
      if(res.response_message == "Success"){
      this.showAddButton = true
      }
    })
  }

  sendValueToParent() {
    const valueToSend = "7";
    this.valueChanged.emit(valueToSend);
  }

  insertUpdateFeeStructure(){
    if(this.feeStructureForm.status == "INVALID"){
      this.feeStructureForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.updateLoader = true
    this.clgId = this.collegeDetails.id
    let feeStructure = this.feeStructureForm.controls.feeStructure.value
    this.campusService.insertUpdateFeeStructure(this.clgId,feeStructure).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text: 'College fee structure updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendValueToParent()
          }
        });
      }else{
        this.updateLoader = false
        Swal.fire('', res.response_message , 'error')
      }

    })
     }
    }

    back(){
      this.sendValueToParent2();
    }

    sendValueToParent2() {
      const valueToSend = "5";
      this.valueChanged.emit(valueToSend);
    }
}
