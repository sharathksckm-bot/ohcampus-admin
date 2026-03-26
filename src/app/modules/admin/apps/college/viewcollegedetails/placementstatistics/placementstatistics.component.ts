import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placementstatistics',
  templateUrl: './placementstatistics.component.html',
  styleUrls: ['./placementstatistics.component.scss']
})
export class PlacementstatisticsComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  @Input() placements: any;
  placementForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  clgId: any;
  showAddButton: boolean = false;
  placeIndex: any;
  getCategoryListData: any;
  placeId: any;
  public maskEid = [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.placementForm = this._formBuilder.group({
        placementArrayData: this._formBuilder.array([]),
      });

      this.clgId = this.collegeDetails.id
      this.addItem()
      if ((this.clgId != null)) {
        this.updateButton = true
        this.Loader = true
      }
      this.getPlacementCategory()
    }

    getPlacementCategory(){
      this.campusService.getPlacementCategory().subscribe((res) =>{
        this.getCategoryListData = res.response_data
        this.getPlacementDetails()
      })
    }

    getPlacementDetails(){
      if(this.clgId != null){
        this.updateButton = true
        this.placements.forEach((data,index) => {
        if(index!=0){
        this.addItem();
      }
      this.placementArrayData().controls[index].get('id').setValue(data.id) ;
      console.log('dfdsfdsfdsfd'+data.year)
      console.log(data.course_category)
        this.placementArrayData().controls[index].get('year').setValue(data.year) ;
        this.placementArrayData().controls[index].get('compVisited').setValue(data.no_of_companies_visited == 0 ? 'NA' : data.no_of_companies_visited) ;
        this.placementArrayData().controls[index].get('studentPlaced').setValue(data.no_of_students_placed == 0 ? 'NA' : data.no_of_students_placed) ;
        this.placementArrayData().controls[index].get('medianSalary').setValue(data.median_salary == 0 ? 'NA' : data.median_salary) ;
        this.placementArrayData().controls[index].get('higherEduStudentPlaced').setValue(data.no_of_student_selected == 0 ? 'NA' : data.no_of_student_selected) ;
        this.placementArrayData().controls[index].get('courseCategory').setValue(data.course_category) ;
      });
      this.addMember()
      this.Loader = false
        }
    }

  checkValidInputData(event: any, type) {
      this.globalService.checkValidInputData(event, type);
  }


  placementArrayData(): FormArray {
      return this.placementForm.get("placementArrayData") as FormArray;

    }

    multiplePlacementData(): FormGroup {
      return this._formBuilder.group({
        id:'',
        year: ['', [Validators.pattern('^[0-9]{4}-?[0-9]{2}$')]],
        compVisited: [''],
        studentPlaced: [''],
        medianSalary: [''],
        higherEduStudentPlaced: [''],
        courseCategory: [''],
      });
    }

    addItem(): void {
      this.placementArrayData().push(this.multiplePlacementData());
      this.showAddButton = false
    }

    addMember(){
      if(this.placementForm.status == "VALID"){
        this.showAddButton = true
      }

    }

    removeItem(placeData,placeIndex) {
      if(placeData?.length > 0){
        this.placementArrayData().removeAt(placeIndex)
      }

      if (placeIndex == 0){
        this.placeId = placeData.value.id;
        this.campusService.deleteAcadmicPlacements(this.placeId).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.showAddButton = true
          }
          })

        this.placementArrayData().controls[placeIndex].get('id').setValue('') ;
        this.placementArrayData().controls[placeIndex].get('year').setValue('') ;
        this.placementArrayData().controls[placeIndex].get('compVisited').setValue('') ;
        this.placementArrayData().controls[placeIndex].get('studentPlaced').setValue('') ;
        this.placementArrayData().controls[placeIndex].get('medianSalary').setValue('') ;
        this.placementArrayData().controls[placeIndex].get('higherEduStudentPlaced').setValue('') ;
        this.placementArrayData().controls[placeIndex].get('courseCategory').setValue('') ;
      }else{
      this.placeId = placeData.value.id;
      this.placementArrayData().removeAt(placeIndex)
      this.campusService.deleteAcadmicPlacements(this.placeId).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.showAddButton = true
      }
      })
    }
    }

    sendValueToParent() {
      const valueToSend = "10";
      this.valueChanged.emit(valueToSend);
    }


    insertUpdatePlacementDetails(){
      if(this.placementForm.status == "INVALID"){
        this.placementForm.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
      this.updateLoader = true
      this.clgId = this.collegeDetails.id
      let placementStats = this.placementForm.controls.placementArrayData.value
      this.campusService.insertupdateAcademicYearForClg(this.clgId,placementStats).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.updateLoader = false
          Swal.fire({
            text: 'College placement statistic updated successful',
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
        const valueToSend = "8";
        this.valueChanged.emit(valueToSend);
      }

}
