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
  selector: 'app-addexam',
  templateUrl: './addexam.component.html',
  styleUrls: ['./addexam.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
  ]
})
export class AddexamComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  indexNum: number = 0;
  activeIndex: number = 0;
  retriveData: any = {} ;
  retriveData2: any = {} ;
  retriveData3: any = {} ;
  type: string = "exams";
  examId: any;
  isChecked: any;
  categoryList: any;
  Loader: boolean = false;
  receivedValue: string;
  getData : boolean = false

  constructor(
        private _formBuilder: FormBuilder,
        private campusService : CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router, ) { }

  ngOnInit(): void {
    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.examId) {
    this.examId = routeParams.examId;
    }
  }

  ngAfterViewInit(): void {
    if ((this.examId != '' && this.examId != undefined)) {
      this.getExamDetailsByIdd();
    }else{
      setTimeout(() => { this.getData = true; }, 500);
    }
  }

  isSelected(index: any): boolean {
    return this.indexNum == index;
  }

  getExamDetailsByIdd(){
    this.campusService.getExamDetailsById(this.examId).subscribe((res) =>{
    if(res.response_message == "Success"){
    this.retriveData = res.exam_data || {};
    this.retriveData2 = res.image_data || {};
    this.retriveData3 = res.image_data || {};
    console.log('Received value in parent:', this.retriveData2);
    this.getData = true
    setTimeout(() => { this.getData = true; }, 500);
    }
  })
  }

  onValueChanged(value: string) {
    if (this.examId == null) {
      this.examId = JSON.parse(localStorage.getItem("postId"));
   }
    this.getExamDetailsByIdd();
    this.receivedValue = value;
    console.log('Received value in parent:', this.receivedValue);
    this.indexNumber(value)
  }

  indexNumber(index){
    this.indexNum = index
    this.activeIndex = index;
  }

  
}
