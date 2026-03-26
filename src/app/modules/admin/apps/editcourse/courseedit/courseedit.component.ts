import { Component, OnInit,ViewChild ,TemplateRef, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../service/date.adapter';
import {  MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-courseedit',
  templateUrl: './courseedit.component.html',
  styleUrls: ['./courseedit.component.scss']
})
export class CourseeditComponent implements OnInit {
  @Output() examIdChanged: EventEmitter<string> = new EventEmitter<string>();
  indexNum: number = 0;
  activeIndex: number = 0;
  Loader: boolean = false;
  getData : boolean = false
  courseId: any;
  course_data: any = {} ;
  image_data: any = {} ;
  category_data: any = {} ;
  receivedValue: any;
  clgId: any;

    constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      const routeParams = this._activatedroute.snapshot.params;
      this.clgId = routeParams.clgId;
      if (routeParams.courseId) {
        this.courseId = routeParams.courseId;
      }
    }

    ngAfterViewInit(): void {
      if ((this.courseId != '' && this.courseId != undefined)) {
        this.getCollegeCourseDetail();
      }else{
        this.getData = true
      }
    }
  
    isSelected(index: any): boolean {
      return this.indexNum == index;
    }

    getCollegeCourseDetail(){
      this.campusService.getCollegeCourseDetail(this.courseId,this.clgId).subscribe((res) =>{
        if(res.response_message == "Success"){
      this.course_data = res.response_data[0] || {};
      this.getData = true
      }else{
        this.getData = true 
      }
     })
    }

      
  onValueChanged(value: string) {
    this.getCollegeCourseDetail();
    this.receivedValue = value;
    console.log('Received value in parent:', this.receivedValue);
    this.indexNumber(value)
  }

  indexNumber(index){
    this.indexNum = index
    this.activeIndex = index;
  }

}
