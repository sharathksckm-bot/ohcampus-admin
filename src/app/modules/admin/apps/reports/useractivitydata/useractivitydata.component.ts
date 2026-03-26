import { Component, OnInit,ViewChild ,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, Form } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-useractivitydata',
  templateUrl: './useractivitydata.component.html',
  styleUrls: ['./useractivitydata.component.scss']
})
export class UseractivitydataComponent implements OnInit {
  Loader : boolean = false;
  userId: any;
  userActivityData: any[]=[];
  userName: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {

    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.userId) {
      this.userId = routeParams.userId;
      this.viewUserActivity()
    }
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }

    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    var d = new Date(inputFormat);
    var day = pad(d.getDate());
    var month = monthNames[d.getMonth()];
    var year = d.getFullYear();
    
    var hours = pad(d.getHours());
    var minutes = pad(d.getMinutes());
    var seconds = pad(d.getSeconds());
    return [day, month, year].join(' ') + ' ' + [hours, minutes, seconds].join(':');
  }

  viewUserActivity(){
    this.campusService.viewUserActivity(this.userId).subscribe((res) =>{
      if(res.response_message == 'Success'){
        this.Loader = true
      this.userActivityData = res.viewUserActivity
      this.userName = res.viewUserActivity[0].user_name
      this.Loader = false;
      }else{
        Swal.fire({
          title: '',
          text: 'User activity details not found...',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Ok'
        }).then((result) => {
          this._route.navigate(['apps/reports/useractivity']);
      })
      }
    });
  }

  back(){
    this._route.navigate(['apps/reports/useractivity']);
  }
}
