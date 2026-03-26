import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {
  displayedColumns: string[] = ['Sr.No', 'icon' ,'title','status','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  facilityList: any[];
  @ViewChild(MatSort) sort: MatSort;
  newFacilities : FormGroup
  listLoader : boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum: number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 1;
  searchLoader : boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
         ) {}

  ngOnInit(): void {
    this.newFacilities = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getFacilitiesList()
  }


  getFacilitiesList(){
    this.campusService.getFacilitiesList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.newFacilities.value.search).subscribe((res) =>{
      this.facilityList = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
      if(this.facilityList?.length != 0){
        this.dataSource = new MatTableDataSource<any>(this.facilityList);
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
    this.getFacilitiesList()
  }

  addFacility(){
    this._route.navigate(['apps/college/addfacilities']);
  }

  applyFilter(filterValue: string) {
    this.searchLoader = true
    this.getFacilitiesList()
    setTimeout(() => { this.searchLoader = false; }, 500);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getFacilitiesList()
  }

  editFacility(faciId) {
    let faci_id = faciId;
    this._route.navigate(['apps/college/addfacilities/update/'+ faci_id]);
  }


  deleteFacility(faciId){
    let faci_id = faciId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete facility',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteFacilities(faci_id).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getFacilitiesList()
              Swal.fire(
                'Deleted!',
                'Your facility has been deleted.',
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
