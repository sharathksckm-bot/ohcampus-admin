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
  selector: 'app-scholershiplist',
  templateUrl: './scholershiplist.component.html',
  styleUrls: ['./scholershiplist.component.scss']
})
export class ScholershiplistComponent implements OnInit {
  displayedColumns: string[] = ['Sr.No','provider_name', 'name','type','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scholarshipListData: any[];
  @ViewChild(MatSort) sort: MatSort;
  scholarshipList : FormGroup
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
    this.scholarshipList = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getScholarshipsList()
  }

  getScholarshipsList(){
    this.campusService.getScholarshipsList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.scholarshipList.value.search).subscribe((res) =>{
      this.scholarshipListData = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.scholarshipListData?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.scholarshipListData);
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
    this.getScholarshipsList()
  }

  addScholarship(){
    this._route.navigate(['apps/scholerships/addscholership']);
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchLoader = true
    this.getScholarshipsList()
    setTimeout(() => { this.searchLoader = false; }, 500);
  }

  editscholarshiplist(scholarId) {
    let scholar_id = scholarId;
    this._route.navigate(['apps/scholerships/addscholership/update/'+ scholar_id]);
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getScholarshipsList()
  }

  deleteScholarships(scholarId){
    let scholar_id = scholarId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete scholarship details',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteScholarships(scholar_id).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getScholarshipsList()
              Swal.fire(
                'Deleted!',
                'Scholarship details has been deleted.',
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
