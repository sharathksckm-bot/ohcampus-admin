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
  selector: 'app-collegetype',
  templateUrl: './collegetype.component.html',
  styleUrls: ['./collegetype.component.scss']
})
export class CollegetypeComponent implements OnInit {
  displayedColumns: string[] = ['Sr.No', 'name','status','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  collegeTypslist: any[];
  @ViewChild(MatSort) sort: MatSort;
  collegeList : FormGroup
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  listLoader:boolean = false;
  Loader : boolean = false;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 1;
  searchLoader : boolean = false;


  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
  ) { }

  ngOnInit(): void {
    this.collegeList = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getCollegeTypes()
  }

  getCollegeTypes(){
    this.campusService.getCollegeTypes(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.collegeList.value.search).subscribe((res) =>{
      this.collegeTypslist = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.collegeTypslist?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.collegeTypslist);
      // this.dataSource.paginator = this.paginator;
      this.listLoader = false;
      this.dataSource.sort = this.sort;
    }else{
      this.listLoader = false;
    }
    })

  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = (this.pageSize * (event.pageIndex))
    this.getCollegeTypes()
  }

  addCollegetype(){
    this._route.navigate(['apps/college/addcollegetype']);
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchLoader = true
    this.getCollegeTypes()
    setTimeout(() => { this.searchLoader = false; }, 500);
  }

  editCollegeType(typeId) {
    let type_id = typeId;
    this._route.navigate(['apps/college/addcollegetype/update/'+ type_id]);
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getCollegeTypes()
  }

  deleteCollegeType(typeId){
    let type_id = typeId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete college type',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteclgTypeDetails(type_id).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getCollegeTypes()
              Swal.fire(
                'Deleted!',
                'Your college type has been deleted.',
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


