import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-collegereport',
  templateUrl: './collegereport.component.html',
  styleUrls: ['./collegereport.component.scss']
})
export class CollegereportComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','title','no_of_articles_linked', 'no_of_brochures_download', 'no_of_application_submitted','no_of_que_asked','no_of_answeres','created_date','updated_date','no_of_views'];
  collegeReportData: any[];
  dataSource : any;
  collegeReport : FormGroup
  listLoader:boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  count: number = 1;
  recordsFiltered: any;
  columnIndex: number = 0;
  searchLoader : boolean = false;


  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    ){ }

    ngOnInit() {
      this.collegeReport = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getCollegeReport();
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
      this.getCollegeReport();
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getCollegeReport();
      setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.getCollegeReport();
    }

    getCollegeReport(){
      this.campusService.getCollegeReport(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.collegeReport.value.search).subscribe((res) =>{
        this.collegeReportData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.collegeReportData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.collegeReportData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

}
