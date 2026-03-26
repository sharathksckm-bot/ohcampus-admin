import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-useractivity',
  templateUrl: './useractivity.component.html',
  styleUrls: ['./useractivity.component.scss']
})
export class UseractivityComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','user_name','email','location', 'Contact','latest_activity','created_date','updated_date','actions'];
  userActivityData: any[];
  dataSource : any;
  userActivity : FormGroup
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
      this.userActivity = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getUserActivity();
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
      this.getUserActivity();
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getUserActivity();
      setTimeout(() => { this.searchLoader = false; }, 500);
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.getUserActivity();
    }

    getUserActivity(){
      this.campusService.getUserActivity(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.userActivity.value.search).subscribe((res) =>{
        this.userActivityData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.userActivityData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.userActivityData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    viewUserActivityDetails(userId){
      this._route.navigate(['apps/reports/useractivitydata/list/'+ userId]);
    }

}
