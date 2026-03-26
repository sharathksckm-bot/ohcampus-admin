import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-editreview',
  templateUrl: './editreview.component.html',
  styleUrls: ['./editreview.component.scss']
})

export class EditreviewComponent implements OnInit {
  reviewForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  reviewId: any;
  retriveData: any;

  status: Status[] = [
    {id: '1', name: 'Active'},
    {id: '0', name: 'Inactive'},
  ];
  numbers: any=[];

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    this.reviewForm = this._formBuilder.group({
      status: ['',[Validators.required]],
    })
  
    const routeParams = this._activatedroute.snapshot.params;
      if (routeParams.reviewId) {
        this.Loader = true
        this.reviewId = routeParams.reviewId;
      }
  }

  ngAfterViewInit(): void {
    if ((this.reviewId != '' && this.reviewId != undefined)) {
      setTimeout(() => { this.getReviewDetailsById(); }, 500);
    }
  }

  getReviewDetailsById(){
    this.updateButton = true 
    this.campusService.getReviewDetailsById(this.reviewId).subscribe((res) =>{
      if(res.response_message == "Success") { 
      this.retriveData = res.response_data[0]
      this.Loader = false
      this.reviewForm.get('status').setValue(this.retriveData.status)
      this.numbers.length = 5
      }
    });
  }

  reviewUpdateStatus(){
    if(this.reviewForm.status == "INVALID"){
      this.reviewForm.markAllAsTouched();
      Swal.fire('', 'Please fill all mandatory data', 'error')
        return
     }else{
    this.updateLoader = true
    let statusId = this.reviewForm.value.status

    this.campusService.reviewUpdateStatus(this.reviewId,statusId ).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.updateLoader = false
        Swal.fire({
          text: 'Review status updated successful',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3290d6 !important",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this._route.navigate(['apps/college/reviewlist']);
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
    this._route.navigate(['apps/college/reviewlist']);
  }

}
