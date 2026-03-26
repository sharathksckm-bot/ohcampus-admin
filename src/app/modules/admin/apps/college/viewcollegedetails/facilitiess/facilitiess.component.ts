import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facilitiess',
  templateUrl: './facilitiess.component.html',
  styleUrls: ['./facilitiess.component.scss']
})
export class FacilitiessComponent implements OnInit {

  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  categoryForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  retriveData: any;
  facilitylist: any;
  selectedItemsList: any;
  checkboxesDataList: any;
  checkedIDs: any[];
  selectedFacilities: any = [];
  clgId: any;
  facilityIds: any ;
  facilitiesId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.getFacilityList()
      this.clgId = this.collegeDetails.id
      this.facilitiesId = this.collegeDetails.facilities.split(',')
    }

    ngAfterViewInit(): void {
      if ((this.clgId != null)) {
        this.updateButton = true
      }
    }

    changeSelection(event: any, value) {
      if (event.checked) {
        this.selectedFacilities.push(value);
      } else {
        const index = this.selectedFacilities.indexOf(value);
        if (index !== -1) {
          this.selectedFacilities.splice(index, 1);
        }
      }
    }

    getFacilityList(){
      this.Loader = true
      this.campusService.getFacilities().subscribe((res) =>{
        this.facilitylist = res.response_data

        this.facilitiesId.forEach((item) => {
          this.facilitylist.forEach((itemm) => {

          if (item === itemm.id) {
            itemm.checked = true;
            this.selectedFacilities.push(itemm);
            this.selectedFacilities;
          }
        });
      })
        this.Loader = false
      })
    }

    sendValueToParent() {
      const valueToSend = "8";
      this.valueChanged.emit(valueToSend);
    }

    updateFacilityForClg(){
      if(this.selectedFacilities.length == 0){
        Swal.fire('', 'Please select facility' , 'error')
        return
      }
      this.updateLoader = true
      this.facilityIds = "";
      this.selectedFacilities.forEach((item, index) => {
          const idAsNumber = Number(item.id);
          this.facilityIds += idAsNumber;
          if (index < this.selectedFacilities.length - 1) {
              this.facilityIds += ",";
          }
      });

      this.campusService.updateFacilityForClg(this.clgId,this.facilityIds).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.updateLoader = false
          Swal.fire({
            text: 'College facility updated successful',
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

    back(){
      this.sendValueToParent2();
    }

    sendValueToParent2() {
      const valueToSend = "6";
      this.valueChanged.emit(valueToSend);
    }

}
