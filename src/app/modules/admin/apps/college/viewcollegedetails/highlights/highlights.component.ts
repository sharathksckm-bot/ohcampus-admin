import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  @Input() highlights_data: any;
  highlightForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  retriveData: any;
  UGCourseslist: any;
  PGCourseslist: any;
  selectedUGCourses: string[] = [];
  selectedPGCourses: any = [];
  clgId: any;
  showAddButton: boolean = false;
  highlightsIndex: any;
    highlightId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.highlightForm = this._formBuilder.group({
      highlights: this._formBuilder.array([]),
    });

    this.clgId = this.collegeDetails.id
    this.addItem()
    if ((this.clgId != null)) {
      this.Loader = true
      this.getHighlightsDetails()
    }

    this.Loader = true

    setTimeout(() => {
        this.Loader = false
    }, 2000);
  }

getHighlightsDetails(){
  if(this.clgId != null){
    this.updateButton = true
    this.highlights_data.forEach((data,index) => {
    if(index!=0){
    this.addItem();
  }
    this.highlights().controls[index].get('id').setValue(data.id)
    this.highlights().controls[index].get('text').setValue(data.text) ;
  });
  this.addMember()
  this.Loader = false
    }

}

  highlights(): FormArray {
    return this.highlightForm.get("highlights") as FormArray;
  }

  multiHighlights(): FormGroup {
    return this._formBuilder.group({
      id:'',
      text: [''],
    });
  }

  addItem(): void {
    this.highlights().push(this.multiHighlights());
    this.showAddButton = false
  }

  addMember(){
    if(this.highlightForm.status == "VALID"){
     this.showAddButton = true
    }
  }

  removeItem(highlightData,highIndex) {

    if(highlightData?.length > 0)
        {        this.highlights().removeAt(highIndex)
        }
        if (highIndex == 0){
            this.highlightId = highlightData.value.id;
            this.campusService.deleteHighlightsOfCollege(this.highlightId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.showAddButton = true
              }
              })

            this.highlights().controls[highIndex].get('id').setValue('') ;
            this.highlights().controls[highIndex].get('text').setValue('') ;
          }else{
          this.highlightId = highlightData.value.id;
          this.highlights().removeAt(highIndex)
          this.campusService.deleteHighlightsOfCollege(this.highlightId).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.showAddButton = true
          }
          })
        }
  }

  sendValueToParent() {
    const valueToSend = "6";
    this.valueChanged.emit(valueToSend);
  }

  insertHighlightsForClg(){
    if(this.highlightForm.status == "INVALID"){
      this.highlightForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.updateLoader = true
    let highlights = this.highlightForm.controls.highlights.value
    this.campusService.updateHighlightsForClg(this.clgId,highlights).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text: 'College highlights added successful',
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

  updateHighlightsForClg(){
    if(this.highlightForm.status == "INVALID"){
      this.highlightForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.updateLoader = true
    let highlights = this.highlightForm.controls.highlights.value
    this.campusService.updateHighlightsForClg(this.clgId,highlights).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text: 'College highlights updated successful',
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
    const valueToSend = "4";
    this.valueChanged.emit(valueToSend);
  }
}
