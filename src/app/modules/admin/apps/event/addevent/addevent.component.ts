import { Component, OnInit,ViewChild ,TemplateRef, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../service/date.adapter';
import {  MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
  ]
})
export class AddeventComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  indexNum: number = 0;
  activeIndex: number = 0;
  Loader: boolean = false;
  getData : boolean = false
  eventId: any;
  Event_data: any = {} ;
  image_data: any = {} ;
  category_data: any = {} ;
  receivedValue: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

  ngOnInit(): void {
    const routeParams = this._activatedroute.snapshot.params;
    if (routeParams.eventId) {
    this.eventId = routeParams.eventId;
    }
    
  }

  ngAfterViewInit(): void {
    if ((this.eventId != '' && this.eventId != undefined)) {
      this.getEventsDetailsById();
    }else{
      setTimeout(() => { this.getData = true; }, 500);
    }
  }

  isSelected(index: any): boolean {
    return this.indexNum == index;
  }

  getEventsDetailsById(){
    this.campusService.getEventsDetailsById(this.eventId).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.Event_data = res.Event_data || {};
        this.image_data = res.image_data || {};
        this.category_data = res.category_data || {};
        setTimeout(() => { this.getData = true; }, 500);
    }
  })
  }
  
  onValueChanged(value: string) {
    if (this.eventId == null) {
         this.eventId = JSON.parse(localStorage.getItem("postId"));
      }
    this.getEventsDetailsById();
    this.receivedValue = value;
    console.log('Received value in parent:', this.receivedValue);
    this.indexNumber(value)
  }

  indexNumber(index){
    this.indexNum = index
    this.activeIndex = index;
  }
}
