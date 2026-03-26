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
  selector: 'app-packagelist',
  templateUrl: './packagelist.component.html',
  styleUrls: ['./packagelist.component.scss']
})
export class PackagelistComponent implements OnInit {

  displayedColumns: string[] = ['Sr.No','name','price','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  packageListData: any[];
  @ViewChild(MatSort) sort: MatSort;
  packageList : FormGroup
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  listLoader:boolean = false;
  Loader : boolean = false;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 1;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
  ) { }

  ngOnInit(): void {
    this.packageList = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getPackagesList()
  }
  
  getPackagesList(){
    this.campusService.getPackagesList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.packageList.value.search).subscribe((res) =>{
      this.packageListData = res.data
      console.log(this.packageListData)
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.packageListData?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.packageListData);
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
    this.getPackagesList()
  }

  addPackagetype(){
    this._route.navigate(['apps/package/addpackage']);
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.getPackagesList()
  }

  editPackage(pkgId) {
    let pkg_id = pkgId;
    this._route.navigate(['apps/package/addpackage/update/'+ pkg_id]);
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getPackagesList()
  }

  deletePackages(pkgId){
    let pkg_id = pkgId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete package details',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deletePackages(pkg_id).subscribe((res) =>{ 
            if(res.response_message == "Success"){
              this.getPackagesList()
              Swal.fire(
                'Deleted!',
                'Package details has been deleted.',
                'success'
              );
            }
          });
        } else {
        }
     
    })
  }
}
