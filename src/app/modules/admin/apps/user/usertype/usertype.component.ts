import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-usertype',
  templateUrl: './usertype.component.html',
  styleUrls: ['./usertype.component.scss']
})
export class UsertypeComponent implements AfterViewInit {
  displayedColumns: string[] = ['Sr.No', 'name' ,'actions'];
  userTypeListData: any[];
  dataSource : any;
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  typeForm : FormGroup
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
    this.typeForm = this._formBuilder.group({
      search : [''],
   })
    this.Loader = true
    this.userTypeList();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = (this.pageSize * (event.pageIndex))
    this.userTypeList();
  }

  addNewtype(){
    this._route.navigate(['apps/user/addnewusertype']);
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.userTypeList()
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchLoader = true
    this.userTypeList();
    setTimeout(() => { this.searchLoader = false; }, 500);
  }

  userTypeList(){
    this.campusService.userTypeList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.typeForm.value.search).subscribe((res) =>{
      this.userTypeListData = res.data;
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
      if(this.userTypeListData?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.userTypeListData);
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.Loader = false
      }else{
        this.Loader = false;
      }
    })
  }

  editUserType(typeId) {
    let type_id = typeId;
    this._route.navigate(['apps/user/addnewusertype/update/'+ type_id]);
  }

  deleteUserType(TypeId){
    let typeId = TypeId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete user Type',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteUserType(typeId).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.userTypeList()
              Swal.fire(
                'Deleted!',
                'User type has been deleted.',
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



