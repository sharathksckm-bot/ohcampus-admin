import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../service/date.adapter';
import {  MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-teamreport',
  templateUrl: './teamreport.component.html',
  styleUrls: ['./teamreport.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
  ]
})
export class TeamreportComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','username','user_type','no_of_colleges_added','no_of_artcles_added','no_of_exams_added','no_of_events_added','created_date','updated_date'];
  teamReportData: any[];
  dataSource : any;
  teamReport : FormGroup
  listLoader:boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 1;
  sortValue: string = "desc";
  search: string = "";
  recordsTotal: any;
  count: number = 1;
  recordsFiltered: any;
  columnIndex: number = 0;
  searchLoader : boolean = false;
  fromDateFrom3month = new Date();
  fromMinDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  minDate = new Date(new Date().setMonth(new Date().getMonth() + 2));
  fromMaxDate = new Date();
  frdate = new Date(new Date().setDate(new Date().getDate() + 7));

  eventMinDate = new Date(new Date().setMonth(new Date().getMonth() - 12));
  eventMaxDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
  userTypeListData: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    ){ }

    ngOnInit() {
      this.teamReport = this._formBuilder.group({
        search: [''],
        fromdate: [''],
        todate: [''],
        userType:['']
     });
     this.listLoader = true
     this.getTeamReport();
     this.userTypeList();
    }

    fromDateChange(event) {
      const d = new Date(this.teamReport.value.Fromdate);
      let month = d.getMonth();
      let today = new Date();
      this.fromDateFrom3month = new Date(new Date(d).setMonth(month + 3));
      var Difference_In_Time = today.getTime() - this.fromDateFrom3month.getTime();
      if (Difference_In_Time < 0)
        this.fromDateFrom3month = today;
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

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getTeamReport();
    }

    applyFilter() {
      this.searchLoader = true
      this.getTeamReport();
      setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.getTeamReport();
    }

    removeForm(){
      this.teamReport.get('fromdate').setValue('')
      this.getTeamReport();
    }
    removeTo(){
      this.teamReport.get('todate').setValue('')
      this.getTeamReport();
    }

    userTypeList(){
      this.campusService.userTypeList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
        this.userTypeListData = res.data
      })
    }

    getTeamReport(){
      this.campusService.getTeamReport(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.teamReport.value.search,this.teamReport.value.userType,this.teamReport.value.fromdate,this.teamReport.value.todate).subscribe((res) =>{
        this.teamReportData = res.data;
        console.log(res.data.updated_date)
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.teamReportData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.teamReportData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    viewTeamReportDetails(id){
      console.log(id)
    }
}
