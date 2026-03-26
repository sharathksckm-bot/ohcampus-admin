import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-userstatus',
  templateUrl: './userstatus.component.html',
  styleUrls: ['./userstatus.component.scss']
})
export class UserstatusComponent implements  AfterViewInit {
  displayedColumns: string[] = ['Sr.No', 'name' ,'actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userStatusListData: PeriodicElement[];
  @ViewChild(MatSort) sort: MatSort;
  statusForm : FormGroup
  page: number = 1;
  pageSize: number = 10;
  Loader : boolean = false;
  startNum: number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 1;
  searchLoader : boolean = false;

  ngAfterViewInit() {
  }

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
  ) { }

  ngOnInit(): void {
    this.statusForm = this._formBuilder.group({
      search : [''],
   })
    this.Loader = true
    this.userStatusList();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = (this.pageSize * (event.pageIndex))
    this.userStatusList();
  }

  addNewStatus(){
    this._route.navigate(['apps/user/addnewuserstatus']);
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.userStatusList()
  }


  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filteredData)
    this.searchLoader = true
    this.userStatusList();
    setTimeout(() => { this.searchLoader = false; }, 500);

  }

  userStatusList(){
    this.campusService.userStatusList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.statusForm.value.search).subscribe((res) =>{
      this.userStatusListData = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
      if(this.userStatusListData?.length != 0){
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.userStatusListData);
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.Loader = false
      }else{
        this.Loader = false;
      }
    })
  }


  editUserStatus(statusId) {
    let status_id = statusId;
    this._route.navigate(['apps/user/addnewuserstatus/update/'+ status_id]);
  }

  deleteUserStatus(StatusId){
    let statusId = StatusId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete user status',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteUserStatus(statusId).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.userStatusList()
              Swal.fire(
                'Deleted!',
                'User status has been deleted.',
                'success'
              );
            }
            else if(res.response_code=="300"){
                Swal.fire({ icon: 'warning',text : res.response_message
            }
                  );
            }
          });
        } else {
        }

    })
  }
}


export interface PeriodicElement {
  name: string;
  id: number;
  action: any;
}
